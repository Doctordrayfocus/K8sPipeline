import { Logic } from './index';
import { FetchRule, LoaderSetup } from '@/modules/types';
import moment from 'moment';
import { io } from 'socket.io-client';
import { reactive } from 'vue';
import { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router';

export default class Common {
  constructor() {
    this.momentInstance = moment;
  }

  public router: Router | undefined = undefined;

  public loadingState = false;

  public apiUrl = '';

  public momentInstance;

  public watchInterval: number | undefined = undefined;

  public socketIo = io({
    reconnectionDelay: 1000,
    reconnection: true,
    reconnectionAttempts: 10,
    transports: ['websocket'],
    agent: false,
    upgrade: false,
    rejectUnauthorized: false,
  });

  public loaderSetup: LoaderSetup = reactive({
    show: false,
    useModal: false,
    hasError: false,
    loading: false,
    message: '',
    ctaText: '',
    ctaFunction: undefined,
    icon: 'success',
    title: '',
  });

  public SetRouter = (router: Router) => {
    this.router = router;
  };

  public GoToRoute = (path: string) => {
    this.router?.push(path);
  };

  public goBack = () => {
    window.history.length > 1 ? this.router?.go(-1) : this.router?.push('/');
  };

  public SetApiUrl = (apiUrl: string) => {
    this.apiUrl = apiUrl;
  };

  public listenForSocketConnection = () => {
    this.socketIo.on('connection', socket => {
      console.log('a user connected');
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  };

  public base64ToUtf8 = (data: string) => {
    return decodeURIComponent(escape(window.atob(data)));
  };

  public debounce = (
    method = () => {
      //
    },
    delay = 500,
  ) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (typeof window.LIT !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      clearTimeout(window.LIT);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.LIT = setTimeout(() => {
      method();
    }, delay);
  };

  public hideLoader = () => {
    const Loader: LoaderSetup = {
      show: false,
      useModal: false,
      loading: false,
    };
    this.loaderSetup = Loader;
  };

  public showLoader = (loaderSetup: LoaderSetup) => {
    this.loaderSetup = loaderSetup;
  };

  public watchProperty = (objectToWatch: any, objectToUpdate: any) => {
    let upatedValue = (this as any)[`${objectToWatch}`];
    const watchAction = () => {
      upatedValue = (this as any)[`${objectToWatch}`];
      if (objectToUpdate) {
        objectToUpdate.value = upatedValue;
      }
      this.watchInterval = window.requestAnimationFrame(watchAction);
    };

    watchAction();
  };

  public stopWatchAction = () => {
    if (this.watchInterval != undefined) {
      window.cancelAnimationFrame(this.watchInterval);
    }
  };

  private isString = (x: any) => {
    return Object.prototype.toString.call(x) === '[object String]';
  };

  public searchArray = (arr: any[], searchKey: string) => {
    return arr.filter(obj => {
      return Object.keys(obj).some(key => {
        return this.isString(obj[key]) ? obj[key].includes(searchKey) : false;
      });
    });
  };

  public fomartDate = (date: string, format: string) => {
    return this.momentInstance(date).format(format);
  };

  public countDownTime = (endTime: number) => {
    return moment(this.momentInstance(endTime).diff(moment.now())).format('mm:ss');
  };

  public timeFromNow = (time: number) => {
    return this.momentInstance(time).fromNow();
  };

  public updatedData = (oldData: any, newData: any) => {
    if (oldData != undefined && newData != undefined) {
      return { ...oldData, ...newData };
    }
    return oldData;
  };

  public makeid = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  public preFetchRouteData = (routeTo: RouteLocationNormalized, next: NavigationGuardNext) => {
    const allActions: Promise<any>[] = [];
    if (this.loaderSetup.loading) {
      return;
    }

    const routeMiddlewares: any = routeTo.meta.middlewares;

    // handle fetchRules

    const fetchRules: FetchRule[] = routeMiddlewares.fetchRules;

    const BreakException = {};

    try {
      fetchRules?.forEach(rule => {
        if (rule.requireAuth) {
          // check auth here
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const domain = Logic[rule.domain];

        if (domain[rule.property] == undefined || (typeof rule.ignoreProperty == 'function' && rule.ignoreProperty()) || rule.ignoreProperty) {
          allActions.push(
            new Promise(resolve => {
              if (rule.useRouteId) {
                rule.params.unshift(routeTo.params.id.toString());
              }
              if (rule.useRouteQuery) {
                rule.queries?.forEach(item => {
                  rule.params.unshift(routeTo.query[item]);
                });
              }
              const request = domain[rule.method](...rule.params);
              request?.then((value: any) => {
                resolve(value);
              });
            }),
          );
        }
      });
    } catch (error) {
      if (error !== BreakException) throw error;
    }

    if (allActions.length > 0) {
      this.showLoader({
        show: true,
        useModal: true,
        loading: true,
      });

      Promise.all(allActions).then(() => {
        this.hideLoader();
        return next();
      });
    } else {
      this.hideLoader();
      return next();
    }
  };
}
