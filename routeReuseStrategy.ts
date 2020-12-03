import {
  RouteReuseStrategy,
  DetachedRouteHandle,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomReuseStrategy implements RouteReuseStrategy {
  routesToReuse = [
    'catalog',
    'work-center-plans',
    'item-plan-detail',
    'erp-alert',
    'pfep-shortage',
    'pfep-required',
    'plans',
    'pfep-summary',
    'home'
  ];

  // this map is in  toUrl:prevUrl format
  routesMap = {
    'catalog': ['edit-detail', 'catalog-detail'],
    'work-center-plans': ['item-plan-detail'],
    'item-plan-detail': ['demand'],
    'erp-alert': ['item-plan-detail'],
    'pfep-shortage': ['item-plan-detail'],
    'pfep-required': ['pfep-summary'],
    'plans': ['item-plan-detail'],
    'pfep-summary': ['item-plan-detail'],
    'home': ['missing-data', 'pfep-required', 'pfep-shortage', 'moq-ceiling', 'demand-gap', 'erp-alert'],
    'single-rack': ['item-plan-detail', 'work-center-plans'],
    'mfcr': ['home']

  };

  // this array is to tell which routes to be held when navigated to certain routes
  routesToStore = {
    'catalog': [
      'catalog',
      'edit-detail',
      'bom',
      'catalog-detail'
    ],
    'work-center-plans': ['work-center-plans', 'item-plan-detail', 'demand', 'single-rack'],
    'item-plan-detail': ['item-plan-detail', 'demand'],
    'erp-alert': ['erp-alert', 'item-plan-detail', 'demand'],
    'pfep-shortage': ['pfep-shortage', 'item-plan-detail', 'demand'],
    'pfep-required': ['pfep-required', 'pfep-summary', 'item-plan-detail', 'demand'],
    'plans': ['plans', 'item-plan-detail', 'demand'],
    'pfep-summary': ['pfep-summary', 'item-plan-detail', 'demand'],
    'home': ['home', 'missing-data', 'pfep-required', 'pfep-shortage', 'moq-ceiling', 'demand-gap', 'erp-alert', 'pfep-summary', 'item-plan-detail', 'demand', 'mfcr'],
    'mfcr': ['item-plan-detail'],
    'single-rack': ['single-rack', 'item-plan-detail', 'demand']
  };

  handlers: { [key: string]: DetachedRouteHandle } = {};

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const path = this.getRouteUrlFromRouterState(route) || '';
    if (this.routesToReuse.indexOf(path) > -1) {
      return true;
    }
    return false; // reuse edit-detail route
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.handlers[`${this.getRouteUrlFromRouterState(route)}`] = handle;
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    this.removeHandles(route);
    const url = this.getRouteUrlFromRouterState(route);
    return !!this.handlers[url];
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    if (!route.routeConfig) { return null; }
    const handle = this.handlers[this.getRouteUrlFromRouterState(route)];
    if (
      handle &&
      (<any>handle).componentRef.instance.routeAttached &&
      route.routeConfig.path !== ''
    ) {
      (<any>handle).componentRef.instance.routeAttached();
    }
    return handle;
  }

  shouldReuseRoute(
    previous: ActivatedRouteSnapshot,
    current: ActivatedRouteSnapshot
  ): boolean {
    const getUrlFromSegments = routeSnapShot => {
      if (routeSnapShot._urlSegment.children.primary) {
        const segmentsLength =
          routeSnapShot._urlSegment.children.primary.segments.length;
        return routeSnapShot._urlSegment.children.primary.segments[
          segmentsLength - 1
        ].path;
      }
      return '';
    };

    let curr = current.url.join('/');
    let prev = previous.url.join('/');
    if (curr === '') {
      curr = getUrlFromSegments(current);
    }
    if (prev === '') {
      prev = getUrlFromSegments(previous);
    }
    return Object.keys(this.routesMap).indexOf(curr) > -1 &&
      this.routesMap[curr].indexOf(prev) > -1
      ? true
      : false;
  }

  getRouteKey(route) {
    let routeUrl = route.routeConfig ? route.routeConfig.path : '';
    if (routeUrl === '') {
      routeUrl = route._routerState.url;
      if (routeUrl.indexOf('/') === 0) {
        routeUrl = routeUrl.substr(1);
      }
    }
    return routeUrl;
  }

  getRouteUrlFromRouterState = route => {
    let routeUrl = route._routerState.url;
    if (routeUrl.indexOf('/') > -1) {
      const routeSegments = routeUrl.split('/');
      routeUrl = routeSegments[routeSegments.length - 1];
    }
    return routeUrl;
  }

  removeHandles(route) {
    const handles = Object.keys(this.handlers);
    const routeUrl = this.getRouteUrlFromRouterState(route);
    if (routeUrl.indexOf('/') === -1) {
      handles.forEach(handle => {
        if (
          route.routeConfig &&
          this.routesToStore[handle] &&
          this.routesToStore[handle].indexOf(routeUrl) === -1
        ) {
          delete this.handlers[handle];
        }
      });
    }
  }
}
