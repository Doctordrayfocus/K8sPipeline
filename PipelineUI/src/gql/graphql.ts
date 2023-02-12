/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreatePipelineDto = {
  lang?: InputMaybe<Scalars['String']>;
  repoDescription?: InputMaybe<Scalars['String']>;
  repoId?: InputMaybe<Scalars['String']>;
  repo_name?: InputMaybe<Scalars['String']>;
  workspaceId?: InputMaybe<Scalars['String']>;
};

export type CreateUserDto = {
  email?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPipelineTemplate: Pipeline;
  createUser?: Maybe<User>;
  deleteUser?: Maybe<User>;
  login?: Maybe<User>;
  logout?: Maybe<User>;
  signup?: Maybe<User>;
  updateSetting?: Maybe<Scalars['Boolean']>;
  updateUser?: Maybe<User>;
};


export type MutationCreatePipelineTemplateArgs = {
  createPipelineData?: InputMaybe<CreatePipelineDto>;
};


export type MutationCreateUserArgs = {
  CreateUserDto: CreateUserDto;
};


export type MutationDeleteUserArgs = {
  userId: Scalars['Int'];
};


export type MutationLoginArgs = {
  CreateUserDto: CreateUserDto;
};


export type MutationSignupArgs = {
  CreateUserDto: CreateUserDto;
};


export type MutationUpdateSettingArgs = {
  settingsUpdateData?: InputMaybe<SettingsUpdateData>;
};


export type MutationUpdateUserArgs = {
  CreateUserDto: CreateUserDto;
  userId: Scalars['Int'];
};

export type Pipeline = {
  __typename?: 'Pipeline';
  createdAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  full_name?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  lang?: Maybe<Scalars['String']>;
  lang_config_folders?: Maybe<Scalars['String']>;
  repo_id?: Maybe<Scalars['String']>;
  repo_url?: Maybe<Scalars['String']>;
  settings?: Maybe<Array<Maybe<PipelineSetting>>>;
  status?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  uuid?: Maybe<Scalars['String']>;
};

export type PipelineSetting = {
  __typename?: 'PipelineSetting';
  branch?: Maybe<Scalars['String']>;
  config_to_use?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  pipeline_id: Scalars['Int'];
  service_config?: Maybe<Scalars['String']>;
  uuid?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getPipelineData?: Maybe<Pipeline>;
  getUserById?: Maybe<User>;
  getUsers: Array<User>;
  pipelines: Array<Pipeline>;
  repositories: Array<Repository>;
  workspaces: Array<Workspace>;
};


export type QueryGetPipelineDataArgs = {
  pipelineUuid: Scalars['String'];
};


export type QueryGetUserByIdArgs = {
  userId: Scalars['Int'];
};


export type QueryRepositoriesArgs = {
  workspaceId: Scalars['String'];
};

export type Repository = {
  __typename?: 'Repository';
  description?: Maybe<Scalars['String']>;
  full_name?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  slug: Scalars['String'];
  uuid: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  password?: Maybe<Scalars['String']>;
};

export type Workspace = {
  __typename?: 'Workspace';
  name: Scalars['String'];
  slug: Scalars['String'];
  uuid: Scalars['String'];
};

export type SettingsUpdateData = {
  configToUse?: InputMaybe<Scalars['String']>;
  serviceConfig?: InputMaybe<Scalars['String']>;
  settingUuid?: InputMaybe<Scalars['String']>;
};
