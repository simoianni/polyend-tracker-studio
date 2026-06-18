//----------------------------------
// Imports
//----------------------------------
import { h, render, VNode, AppContext, ComponentPublicInstance } from 'vue';

//----------------------------------
// Private Variables
//----------------------------------
let appContext: AppContext | null = null;

export default class VueComp {
  //----------------------------------
  // Getter Setter
  //----------------------------------
  /**
   * Sets the main application context. This is required for component injection.
   * @param context The AppContext instance from the main Vue app.
   */
  static set appContext(context: AppContext) {
    appContext = context;
  }

  /**
   * Gets the main application context.
   * @returns {AppContext | null}
   */
  static get appContext(): AppContext | null {
    return appContext;
  }

  //----------------------------------
  // Public Static Methods
  //----------------------------------
  /**
   * Programmatically creates and renders a Vue component instance.
   *
   * @param component The Vue component to render.
   * @param target The DOM element to append the component container to. Defaults to document.body.
   * @param props The props to pass to the component.
   * @returns The proxy instance of the rendered component.
   */
  static create(
    component: any,
    target: HTMLElement = document.body,
    props: Record<string, any> = {},
  ): ComponentPublicInstance {
    if (!appContext) {
      throw new Error(
        'appContext missing. Please provide the main app context by calling VueComponent.appContext = instance.appContext',
      );
    }

    const div = document.createElement('div');
    target.appendChild(div);

    // Combine original props with a handler for the 'close' event.
    const vnode: VNode = h(component, {
      ...props,
      onClose: (event: Event) => {
        // Retrieve the component's proxy instance from the VNode.
        const vm = vnode.component?.proxy;
        if (vm) {
          // Trigger the cleanup method.
          VueComp.remove(vm);
          // Call the original onClose handler if one was provided in the props.
          if (props.onClose && typeof props.onClose === 'function') {
            props.onClose(event);
          }
        }
      },
    });

    // Assign the application context to the VNode, enabling injections like `provide/inject`.
    vnode.appContext = appContext;

    // Render the VNode to the container div.
    render(vnode, div);

    // Return the component's public proxy instance.
    return vnode.component!.proxy!;
  }

  /**
   * Removes and unmounts a component instance from the DOM.
   *
   * @param vm The component proxy instance to remove.
   */
  static remove(vm: ComponentPublicInstance): void {
    if (!vm || !vm.$el) {
      console.warn('Cannot remove unmounted or invalid instance.');
      return;
    }

    const node = vm.$el.parentNode as HTMLElement;
    if (node) {
      // Unmount the component by rendering null to its container.
      render(null, node);
      // Clean up the container element from the DOM.
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    }
  }
}
