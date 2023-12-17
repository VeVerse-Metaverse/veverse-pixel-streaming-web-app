import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import store from "../index";
import pixelstreamingAPI from "../../api/pixelstreaming";
import { PixelStreamingSessionRequestMetadata } from "../../api/models";

export interface IPSInterface {
  appId: string;
  sessionId: string;
  streamUrl: string;
  isAvailableFreeStreams: boolean;
}

@Module({ dynamic: true, store, name: "ps", namespaced: true })
class PSModule extends VuexModule implements IPSInterface {
  appId: string = "";
  sessionId: string = "";
  streamUrl: string = "";
  isAvailableFreeStreams: boolean = true;


  get getSessionId() {
    return this.sessionId;
  }

  @Mutation
  restoreSavedState(payload: { [name: string]: any }) {
    if (payload.appId) this.appId = payload.appId;
    else {

    }

    if(payload.sessionId) this.sessionId = payload.sessionId;
    else {

    }
  }

  @Mutation
  setAppId(payload: { [name: string]: any }) {
    this.appId = payload.appId;
  }

  @Mutation
  setSessionId(payload: { [name: string]: any }) {
    this.sessionId = payload.sessionId;
  }

  @Mutation
  setAvailableFreeStreams(payload: { [name: string]: any }) {
    this.isAvailableFreeStreams = payload.isAvailableFreeStreams;
  }

  @Action({ rawError: true })
  async requestNewSession(payload: PixelStreamingSessionRequestMetadata) {
    try {
      const { data } = await pixelstreamingAPI.requestStreamingSession(payload.appId);

      if(data.freeInstance) {
        this.context.commit('setSessionId', {sessionId: data.sessionId})
        this.context.commit('setAvailableFreeStreams', {isAvailableFreeStreams: true})
      } else {
        this.context.commit('setAvailableFreeStreams', {isAvailableFreeStreams: false})
      }
    } catch (err) {
      console.log(err);
    }
  }

  @Mutation
  setStreamUrl(payload: { [name: string]: any }) {
    this.streamUrl = "http://" + payload.host + ":" + payload.port;
  }

  @Action({ rawError: true })
  async requestStreamData(payload: { [name: string]: any }) {
    try {
      const { data } = await pixelstreamingAPI.requestStreamSessionData(payload.sessionId);
      const { instance } = data;

      this.context.commit('setStreamUrl', { host: instance.host, port: instance.port })
    } catch (err) {
      console.log(err);
    }
  }
}

export default getModule(PSModule);
