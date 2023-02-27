import { AuthStrategyEntity } from '@/entities/authStrategy.entity';
import { EntityRepository } from 'typeorm';
import passport from 'passport';
import { GitLabStrategy as GitHubStrategy } from 'passport-github2';
import {
  APP_URL,
  BITBUCKET_CLIENT_ID,
  BITBUCKET_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITLAB_APP_ID,
  GITLAB_APP_SECRET,
} from '@/config';
import { AuthStrategy } from '@/interfaces/authStrategy.inteface';
import { Strategy as GitLabStrategy } from 'passport-gitlab2';
import { Strategy as BitbucketStrategy } from 'passport-bitbucket-oauth2';
import refresh from 'passport-oauth2-refresh';

@EntityRepository(AuthStrategyEntity)
export default class AuthStrategyRepository {
  private saveAuthStrategy(accessToken, refreshToken, profileId, type) {
    const strategyData: AuthStrategy = {
      access_token: accessToken,
      profileId: profileId,
      refresh_token: refreshToken,
      type,
    };

    AuthStrategyEntity.find({
      where: [
        {
          profileId: profileId,
        },
      ],
    }).then(strategy => {
      if (strategy.length > 0) {
        strategy[0].access_token = strategyData.access_token;
        strategy[0].refresh_token = strategyData.refresh_token;
        strategy[0].type = strategyData.type;
        strategy[0].save();
      } else {
        AuthStrategyEntity.create({ ...strategyData })
          .save()
          .then(() => {
            console.log(`${type} strategy saved`);
          })
          .catch(error => {
            console.log(error);
          });
      }
    });
  }

  private configureGithub() {
    passport.use(
      new GitHubStrategy(
        {
          clientID: GITHUB_CLIENT_ID,
          clientSecret: GITHUB_CLIENT_SECRET,
          callbackURL: `https://${APP_URL}/auth/github/callback`,
        },
        (accessToken, refreshToken, profile) => {
          this.saveAuthStrategy(accessToken, refreshToken, profile.id, 'github');
        },
      ),
    );
  }

  private configureGitlab() {
    passport.use(
      new GitLabStrategy(
        {
          clientID: GITLAB_APP_ID,
          clientSecret: GITLAB_APP_SECRET,
          callbackURL: `https://${APP_URL}/auth/gitlab/callback`,
        },
        (accessToken, refreshToken, profile) => {
          this.saveAuthStrategy(accessToken, refreshToken, profile.id, 'gitlab');
        },
      ),
    );
  }

  private configureBitbucket() {
    const strategy = new BitbucketStrategy(
      {
        clientID: BITBUCKET_CLIENT_ID,
        clientSecret: BITBUCKET_CLIENT_SECRET,
        callbackURL: `https://${APP_URL}/auth/bitbucket/callback`,
      },
      (accessToken, refreshToken, profile) => {
        this.saveAuthStrategy(accessToken, refreshToken, profile.username, 'bitbucket');
      },
    );
    passport.use(strategy);
    refresh.use(strategy);
  }

  public requestNewAccessToken = (strategy: string, refreshToken: string): Promise<string> => {
    return new Promise(resolve => {
      refresh.requestNewAccessToken(strategy, refreshToken, (err, accessToken) => {
        resolve(accessToken);
      });
    });
  };

  public authenticateStategy(type: 'github' | 'gitlab' | 'bitbucket') {
    if (type == 'github') {
      this.configureGithub();
      return passport.authenticate('github', { scope: ['repo'] });
    }

    if (type == 'gitlab') {
      this.configureGitlab();
      return passport.authenticate('gitlab', { scope: ['api'] });
    }

    if (type == 'bitbucket') {
      this.configureBitbucket();
      return passport.authenticate('bitbucket', { scope: ['repository:admin', 'webhook'] });
    }
  }

  public handleGithubCallback(type: 'github' | 'gitlab' | 'bitbucket') {
    if (type == 'github') {
      this.configureGithub();
      return passport.authenticate('github', { failureRedirect: '/' });
    }
    if (type == 'gitlab') {
      this.configureGitlab();
      return passport.authenticate('gitlab', { failureRedirect: '/' });
    }

    if (type == 'bitbucket') {
      this.configureBitbucket();
      return passport.authenticate('bitbucket', { failureRedirect: '/' });
    }
  }
}
