export const typeDefs = `#graphql
  # Comments in GraphQL Strings (such as this one) start with the hash (#) symbol.

  input CreateUserDto {
    email: String
  password: String
  }

  input CreatePipelineDto {
    workspaceId: String
    repoId: String
    repoDescription: String
    repo_name: String
    lang: String
  }

  input settingsUpdateData {
    settingUuid: String
    configToUse: String
    serviceConfig: String
  }

  type User {
    id: ID
    email: String
    password: String
  }

  type Workspace {
    slug: String!
    name: String!
    uuid: String!
  }

  type Pipeline {
    id: ID
    uuid: String
    repo_url: String
    repo_id: String
    lang: String
    description: String
    status: String
    full_name: String
    createdAt: String
    updatedAt: String
    settings: [PipelineSetting]
    builds: [PipelineBuild]
    lang_config_folders: String
}

type PipelineSetting {
  id: ID
  uuid: String
  branch: String
  pipeline_id: Int!
  service_config: String
  config_to_use: String
}

type PipelineBuild {
  id: ID
  uuid: String
  title: String
  status: String
  started_at: String
  ended_at: String
  content: String
  branch: String
  commit_id: String
  pipelineUuid: String
}

type Repository {
  full_name: String
  name: String!
  slug: String!
  description: String
  uuid: String!
}


 type Query {
  workspaces: [Workspace!]!
  repositories(
    workspaceId: String!
  ): [Repository!]!
  pipelines: [Pipeline!]!
  getUsers: [User!]!
  getUserById(
    userId: Int!
  ): User
  getPipelineData(
    pipelineUuid: String!
  ): Pipeline
  getBuildData(
    buildUuid: String!
  ): PipelineBuild
 }

 type Mutation {
  signup(
    CreateUserDto: CreateUserDto!
  ): User
  login(
    CreateUserDto: CreateUserDto!
  ): User
  logout: User
  createPipelineTemplate(
    createPipelineData: CreatePipelineDto
  ): Pipeline!
  createUser(
    CreateUserDto: CreateUserDto!
  ): User
  updateUser(
    userId: Int!
    CreateUserDto: CreateUserDto!
  ): User
  deleteUser(
    userId: Int!
  ): User
  updateSetting(
    settingsUpdateData: settingsUpdateData
  ): Boolean
 }
`;
