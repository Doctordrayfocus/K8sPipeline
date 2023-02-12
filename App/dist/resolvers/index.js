"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolvers", {
    enumerable: true,
    get: ()=>resolvers
});
const _pipelineResolver = require("./pipeline.resolver");
const _authResolver = require("./auth.resolver");
const _usersResolver = require("./users.resolver");
const AuthResolver = new _authResolver.authResolver();
const UserResolver = new _usersResolver.userResolver();
const PipelineResolver = new _pipelineResolver.pipelineResolver();
const resolvers = {
    Query: {
        workspaces () {
            return PipelineResolver.workspaces();
        },
        repositories (_parent, args) {
            return PipelineResolver.repositories(args.workspaceId);
        },
        pipelines () {
            return PipelineResolver.pipelines();
        },
        getUsers () {
            return UserResolver.getUsers();
        },
        getUserById (_parent, args) {
            return UserResolver.getUserById(args.userId);
        },
        getPipelineData (_parent, args) {
            return PipelineResolver.getPipeline(args.pipelineUuid);
        }
    },
    Mutation: {
        signup (_parent, args) {
            return AuthResolver.signup(args.userData);
        },
        login (_parent, args) {
            return AuthResolver.login(args.userData);
        },
        logout (_parent, args) {
            return AuthResolver.logout(args.userData);
        },
        createPipelineTemplate (_parent, args) {
            return PipelineResolver.createPipelineTemplate(args.createPipelineData);
        },
        createUser (_parent, args) {
            return UserResolver.createUser(args.userData);
        },
        updateUser (_parent, args) {
            return UserResolver.updateUser(args.userId, args.userData);
        },
        deleteUser (_parent, args) {
            return UserResolver.deleteUser(args.userId);
        },
        updateSetting (_parent, args) {
            return PipelineResolver.updateSetting(args.settingsUpdateData);
        }
    }
};

//# sourceMappingURL=index.js.map