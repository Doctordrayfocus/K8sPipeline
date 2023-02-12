import { pipelineResolver } from './pipeline.resolver';
import { authResolver } from './auth.resolver';
import { userResolver } from './users.resolver';

const AuthResolver = new authResolver();
const UserResolver = new userResolver();
const PipelineResolver = new pipelineResolver();

export const resolvers = {
  Query: {
    workspaces() {
      return PipelineResolver.workspaces();
    },
    repositories(_parent, args) {
      return PipelineResolver.repositories(args.workspaceId);
    },
    pipelines() {
      return PipelineResolver.pipelines();
    },
    getUsers() {
      return UserResolver.getUsers();
    },
    getUserById(_parent, args) {
      return UserResolver.getUserById(args.userId);
    },
    getPipelineData(_parent, args) {
      return PipelineResolver.getPipeline(args.pipelineUuid);
    },
  },
  Mutation: {
    signup(_parent, args) {
      return AuthResolver.signup(args.userData);
    },
    login(_parent, args) {
      return AuthResolver.login(args.userData);
    },
    logout(_parent, args) {
      return AuthResolver.logout(args.userData);
    },
    createPipelineTemplate(_parent, args) {
      return PipelineResolver.createPipelineTemplate(args.createPipelineData);
    },
    createUser(_parent, args) {
      return UserResolver.createUser(args.userData);
    },
    updateUser(_parent, args) {
      return UserResolver.updateUser(args.userId, args.userData);
    },
    deleteUser(_parent, args) {
      return UserResolver.deleteUser(args.userId);
    },
    updateSetting(_parent, args) {
      return PipelineResolver.updateSetting(args.settingsUpdateData);
    },
  },
};
