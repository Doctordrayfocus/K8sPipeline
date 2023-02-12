import AuthApi from "./AuthApi";
import PipelineApi from "./PipelineApi";

export const $api = {
	auth: new AuthApi(),
	pipeline: new PipelineApi()
};
