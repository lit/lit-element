/**
 * @fileoverview Allow custom element classes to do hot module reloading.
 *
 * IMPORTANT:
 * Hot module reloading is hot in the sense of fast, but also hot as
 * in CAUTION WILL VAPORIZE FINGERS. When in doubt, reload the page, and never
 * ever use when connected to a production store of data. It *will* violate the
 * assumptions of otherwise-correct code, causing it to execute undefined
 * behavior.
 *
 * An element class that defines the method notifyOnHotModuleReload can be
 * defined on the custom elements registry multiple times. The first time,
 * the element is registered normally. Each subsequent time, the original will
 * receive a call to notifyOnHotModuleReload with the new class object, where
 * it can patch prototypes, re-render existing instances, etc.
 *
 * See the implementation on LitElement for one way of hooking this up. It works
 * well enough for elements that are pure functions of their state.
 *
 * All of the usual concerns about hot module reloading definitely apply.
 * Concerns like that it's a "mad dream" and is "poorly conceived", or that it
 * "violates most every reasonable assumption one might have about a body of
 * code". All still true, still valid. But it can't be ignored that it also can
 * make for a *much* nicer development experience for a lot of frontend dev.
 */

interface Constructor<T> {
  new(): T;
}
interface HotReloadableElementClass extends Constructor<HTMLElement> {
  notifyOnHotModuleReload(
      tagname: string, updatedClass: HotReloadableElementClass): void;
}

function patchCustomElementsDefine() {
  function isHotReloadableElementClass(maybe: Constructor<HTMLElement>):
      maybe is HotReloadableElementClass {
    // This isn't rename safe, but this is definitely debug code, it's
    // not even compatible with bundling, let alone renaming, so that's fine.
    return 'notifyOnHotModuleReload' in maybe;
  }

  const originalDefine = customElements.define;

  const implMap = new Map<string, HotReloadableElementClass>();
  function hotDefine(tagname: string, classObj: Constructor<HTMLElement>) {
    if (!isHotReloadableElementClass(classObj)) {
      return originalDefine.call(customElements, tagname, classObj);
    }
    const impl = implMap.get(tagname);
    if (!impl) {
      implMap.set(tagname, classObj);
      originalDefine.call(customElements, tagname, classObj);
    } else {
      impl.notifyOnHotModuleReload(tagname, classObj);
    }
  }

  customElements.define = hotDefine;
}
// Just to be extra sure this never ends up in production.
if (goog.DEBUG) {
  patchCustomElementsDefine();
}

export {};
