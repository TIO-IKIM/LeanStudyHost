
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var pmgmt = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately after the component has been updated.
     *
     * The first time the callback runs will be after the initial `onMount`
     */
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.55.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /* node_modules/carbon-components-svelte/src/icons/ChevronRight.svelte generated by Svelte v3.55.1 */

    const file$K = "node_modules/carbon-components-svelte/src/icons/ChevronRight.svelte";

    // (24:2) {#if title}
    function create_if_block$x(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$K, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$x.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$O(ctx) {
    	let svg;
    	let path;
    	let if_block = /*title*/ ctx[1] && create_if_block$x(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path = svg_element("path");
    			attr_dev(path, "d", "M22 16L12 26 10.6 24.6 19.2 16 10.6 7.4 12 6z");
    			add_location(path, file$K, 24, 2, 579);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$K, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$x(ctx);
    					if_block.c();
    					if_block.m(svg, path);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$O.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$O($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChevronRight', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class ChevronRight extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$O, create_fragment$O, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChevronRight",
    			options,
    			id: create_fragment$O.name
    		});
    	}

    	get size() {
    		throw new Error("<ChevronRight>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ChevronRight>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ChevronRight>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ChevronRight>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ChevronRight$1 = ChevronRight;

    /* node_modules/carbon-components-svelte/src/Button/ButtonSkeleton.svelte generated by Svelte v3.55.1 */

    const file$J = "node_modules/carbon-components-svelte/src/Button/ButtonSkeleton.svelte";

    // (35:0) {:else}
    function create_else_block$9(ctx) {
    	let div;
    	let mounted;
    	let dispose;
    	let div_levels = [/*$$restProps*/ ctx[2]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--skeleton", true);
    			toggle_class(div, "bx--btn", true);
    			toggle_class(div, "bx--btn--field", /*size*/ ctx[1] === 'field');
    			toggle_class(div, "bx--btn--sm", /*size*/ ctx[1] === 'small');
    			toggle_class(div, "bx--btn--lg", /*size*/ ctx[1] === 'lg');
    			toggle_class(div, "bx--btn--xl", /*size*/ ctx[1] === 'xl');
    			add_location(div, file$J, 35, 2, 801);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*click_handler_1*/ ctx[7], false, false, false),
    					listen_dev(div, "mouseover", /*mouseover_handler_1*/ ctx[8], false, false, false),
    					listen_dev(div, "mouseenter", /*mouseenter_handler_1*/ ctx[9], false, false, false),
    					listen_dev(div, "mouseleave", /*mouseleave_handler_1*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2]]));
    			toggle_class(div, "bx--skeleton", true);
    			toggle_class(div, "bx--btn", true);
    			toggle_class(div, "bx--btn--field", /*size*/ ctx[1] === 'field');
    			toggle_class(div, "bx--btn--sm", /*size*/ ctx[1] === 'small');
    			toggle_class(div, "bx--btn--lg", /*size*/ ctx[1] === 'lg');
    			toggle_class(div, "bx--btn--xl", /*size*/ ctx[1] === 'xl');
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$9.name,
    		type: "else",
    		source: "(35:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (16:0) {#if href}
    function create_if_block$w(ctx) {
    	let a;
    	let t_value = "" + "";
    	let t;
    	let a_rel_value;
    	let mounted;
    	let dispose;

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{
    			rel: a_rel_value = /*$$restProps*/ ctx[2].target === '_blank'
    			? 'noopener noreferrer'
    			: undefined
    		},
    		{ role: "button" },
    		/*$$restProps*/ ctx[2]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			set_attributes(a, a_data);
    			toggle_class(a, "bx--skeleton", true);
    			toggle_class(a, "bx--btn", true);
    			toggle_class(a, "bx--btn--field", /*size*/ ctx[1] === 'field');
    			toggle_class(a, "bx--btn--sm", /*size*/ ctx[1] === 'small');
    			toggle_class(a, "bx--btn--lg", /*size*/ ctx[1] === 'lg');
    			toggle_class(a, "bx--btn--xl", /*size*/ ctx[1] === 'xl');
    			add_location(a, file$J, 16, 2, 337);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(a, "mouseover", /*mouseover_handler*/ ctx[4], false, false, false),
    					listen_dev(a, "mouseenter", /*mouseenter_handler*/ ctx[5], false, false, false),
    					listen_dev(a, "mouseleave", /*mouseleave_handler*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*href*/ 1 && { href: /*href*/ ctx[0] },
    				dirty & /*$$restProps*/ 4 && a_rel_value !== (a_rel_value = /*$$restProps*/ ctx[2].target === '_blank'
    				? 'noopener noreferrer'
    				: undefined) && { rel: a_rel_value },
    				{ role: "button" },
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2]
    			]));

    			toggle_class(a, "bx--skeleton", true);
    			toggle_class(a, "bx--btn", true);
    			toggle_class(a, "bx--btn--field", /*size*/ ctx[1] === 'field');
    			toggle_class(a, "bx--btn--sm", /*size*/ ctx[1] === 'small');
    			toggle_class(a, "bx--btn--lg", /*size*/ ctx[1] === 'lg');
    			toggle_class(a, "bx--btn--xl", /*size*/ ctx[1] === 'xl');
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$w.name,
    		type: "if",
    		source: "(16:0) {#if href}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$N(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[0]) return create_if_block$w;
    		return create_else_block$9;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$N.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$N($$self, $$props, $$invalidate) {
    	const omit_props_names = ["href","size"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ButtonSkeleton', slots, []);
    	let { href = undefined } = $$props;
    	let { size = "default" } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('href' in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ('size' in $$new_props) $$invalidate(1, size = $$new_props.size);
    	};

    	$$self.$capture_state = () => ({ href, size });

    	$$self.$inject_state = $$new_props => {
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('size' in $$props) $$invalidate(1, size = $$new_props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		href,
    		size,
    		$$restProps,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		click_handler_1,
    		mouseover_handler_1,
    		mouseenter_handler_1,
    		mouseleave_handler_1
    	];
    }

    class ButtonSkeleton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$N, create_fragment$N, safe_not_equal, { href: 0, size: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ButtonSkeleton",
    			options,
    			id: create_fragment$N.name
    		});
    	}

    	get href() {
    		throw new Error("<ButtonSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<ButtonSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<ButtonSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ButtonSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ButtonSkeleton$1 = ButtonSkeleton;

    /* node_modules/carbon-components-svelte/src/Button/Button.svelte generated by Svelte v3.55.1 */
    const file$I = "node_modules/carbon-components-svelte/src/Button/Button.svelte";
    const get_default_slot_changes$1 = dirty => ({ props: dirty[0] & /*buttonProps*/ 512 });
    const get_default_slot_context$1 = ctx => ({ props: /*buttonProps*/ ctx[9] });

    // (163:0) {:else}
    function create_else_block$8(ctx) {
    	let button;
    	let t;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*hasIconOnly*/ ctx[8] && create_if_block_4$5(ctx);
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
    	var switch_value = /*icon*/ ctx[2];

    	function switch_props(ctx) {
    		return {
    			props: {
    				"aria-hidden": "true",
    				class: "bx--btn__icon",
    				style: /*hasIconOnly*/ ctx[8] ? 'margin-left: 0' : undefined,
    				"aria-label": /*iconDescription*/ ctx[3]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	let button_levels = [/*buttonProps*/ ctx[9]];
    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			set_attributes(button, button_data);
    			add_location(button, file$I, 163, 2, 4429);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			if (if_block) if_block.m(button, null);
    			append_dev(button, t);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (switch_instance) mount_component(switch_instance, button, null);
    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[33](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler_2*/ ctx[24], false, false, false),
    					listen_dev(button, "mouseover", /*mouseover_handler_2*/ ctx[25], false, false, false),
    					listen_dev(button, "mouseenter", /*mouseenter_handler_2*/ ctx[26], false, false, false),
    					listen_dev(button, "mouseleave", /*mouseleave_handler_2*/ ctx[27], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*hasIconOnly*/ ctx[8]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4$5(ctx);
    					if_block.c();
    					if_block.m(button, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}

    			const switch_instance_changes = {};
    			if (dirty[0] & /*hasIconOnly*/ 256) switch_instance_changes.style = /*hasIconOnly*/ ctx[8] ? 'margin-left: 0' : undefined;
    			if (dirty[0] & /*iconDescription*/ 8) switch_instance_changes["aria-label"] = /*iconDescription*/ ctx[3];

    			if (switch_value !== (switch_value = /*icon*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, button, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [dirty[0] & /*buttonProps*/ 512 && /*buttonProps*/ ctx[9]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			if (switch_instance) destroy_component(switch_instance);
    			/*button_binding*/ ctx[33](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(163:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (143:28)
    function create_if_block_2$6(ctx) {
    	let a;
    	let t;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*hasIconOnly*/ ctx[8] && create_if_block_3$5(ctx);
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
    	var switch_value = /*icon*/ ctx[2];

    	function switch_props(ctx) {
    		return {
    			props: {
    				"aria-hidden": "true",
    				class: "bx--btn__icon",
    				"aria-label": /*iconDescription*/ ctx[3]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	let a_levels = [/*buttonProps*/ ctx[9]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			set_attributes(a, a_data);
    			add_location(a, file$I, 144, 2, 4046);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if (if_block) if_block.m(a, null);
    			append_dev(a, t);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			if (switch_instance) mount_component(switch_instance, a, null);
    			/*a_binding*/ ctx[32](a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler_1*/ ctx[20], false, false, false),
    					listen_dev(a, "mouseover", /*mouseover_handler_1*/ ctx[21], false, false, false),
    					listen_dev(a, "mouseenter", /*mouseenter_handler_1*/ ctx[22], false, false, false),
    					listen_dev(a, "mouseleave", /*mouseleave_handler_1*/ ctx[23], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*hasIconOnly*/ ctx[8]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3$5(ctx);
    					if_block.c();
    					if_block.m(a, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}

    			const switch_instance_changes = {};
    			if (dirty[0] & /*iconDescription*/ 8) switch_instance_changes["aria-label"] = /*iconDescription*/ ctx[3];

    			if (switch_value !== (switch_value = /*icon*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, a, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [dirty[0] & /*buttonProps*/ 512 && /*buttonProps*/ ctx[9]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			if (switch_instance) destroy_component(switch_instance);
    			/*a_binding*/ ctx[32](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$6.name,
    		type: "if",
    		source: "(143:28) ",
    		ctx
    	});

    	return block;
    }

    // (141:13)
    function create_if_block_1$8(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope, buttonProps*/ 262656)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(141:13) ",
    		ctx
    	});

    	return block;
    }

    // (130:0) {#if skeleton}
    function create_if_block$v(ctx) {
    	let buttonskeleton;
    	let current;

    	const buttonskeleton_spread_levels = [
    		{ href: /*href*/ ctx[7] },
    		{ size: /*size*/ ctx[1] },
    		/*$$restProps*/ ctx[10],
    		{
    			style: /*hasIconOnly*/ ctx[8] && 'width: 3rem;'
    		}
    	];

    	let buttonskeleton_props = {};

    	for (let i = 0; i < buttonskeleton_spread_levels.length; i += 1) {
    		buttonskeleton_props = assign(buttonskeleton_props, buttonskeleton_spread_levels[i]);
    	}

    	buttonskeleton = new ButtonSkeleton$1({
    			props: buttonskeleton_props,
    			$$inline: true
    		});

    	buttonskeleton.$on("click", /*click_handler*/ ctx[28]);
    	buttonskeleton.$on("mouseover", /*mouseover_handler*/ ctx[29]);
    	buttonskeleton.$on("mouseenter", /*mouseenter_handler*/ ctx[30]);
    	buttonskeleton.$on("mouseleave", /*mouseleave_handler*/ ctx[31]);

    	const block = {
    		c: function create() {
    			create_component(buttonskeleton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(buttonskeleton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const buttonskeleton_changes = (dirty[0] & /*href, size, $$restProps, hasIconOnly*/ 1410)
    			? get_spread_update(buttonskeleton_spread_levels, [
    					dirty[0] & /*href*/ 128 && { href: /*href*/ ctx[7] },
    					dirty[0] & /*size*/ 2 && { size: /*size*/ ctx[1] },
    					dirty[0] & /*$$restProps*/ 1024 && get_spread_object(/*$$restProps*/ ctx[10]),
    					dirty[0] & /*hasIconOnly*/ 256 && {
    						style: /*hasIconOnly*/ ctx[8] && 'width: 3rem;'
    					}
    				])
    			: {};

    			buttonskeleton.$set(buttonskeleton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttonskeleton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buttonskeleton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(buttonskeleton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$v.name,
    		type: "if",
    		source: "(130:0) {#if skeleton}",
    		ctx
    	});

    	return block;
    }

    // (172:4) {#if hasIconOnly}
    function create_if_block_4$5(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*iconDescription*/ ctx[3]);
    			toggle_class(span, "bx--assistive-text", true);
    			add_location(span, file$I, 172, 6, 4578);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*iconDescription*/ 8) set_data_dev(t, /*iconDescription*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$5.name,
    		type: "if",
    		source: "(172:4) {#if hasIconOnly}",
    		ctx
    	});

    	return block;
    }

    // (153:4) {#if hasIconOnly}
    function create_if_block_3$5(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*iconDescription*/ ctx[3]);
    			toggle_class(span, "bx--assistive-text", true);
    			add_location(span, file$I, 153, 6, 4190);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*iconDescription*/ 8) set_data_dev(t, /*iconDescription*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$5.name,
    		type: "if",
    		source: "(153:4) {#if hasIconOnly}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$M(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$v, create_if_block_1$8, create_if_block_2$6, create_else_block$8];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*skeleton*/ ctx[5]) return 0;
    		if (/*as*/ ctx[4]) return 1;
    		if (/*href*/ ctx[7] && !/*disabled*/ ctx[6]) return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$M.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$M($$self, $$props, $$invalidate) {
    	let hasIconOnly;
    	let buttonProps;

    	const omit_props_names = [
    		"kind","size","expressive","isSelected","icon","iconDescription","tooltipAlignment","tooltipPosition","as","skeleton","disabled","href","tabindex","type","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	const $$slots = compute_slots(slots);
    	let { kind = "primary" } = $$props;
    	let { size = "default" } = $$props;
    	let { expressive = false } = $$props;
    	let { isSelected = false } = $$props;
    	let { icon = undefined } = $$props;
    	let { iconDescription = undefined } = $$props;
    	let { tooltipAlignment = "center" } = $$props;
    	let { tooltipPosition = "bottom" } = $$props;
    	let { as = false } = $$props;
    	let { skeleton = false } = $$props;
    	let { disabled = false } = $$props;
    	let { href = undefined } = $$props;
    	let { tabindex = "0" } = $$props;
    	let { type = "button" } = $$props;
    	let { ref = null } = $$props;
    	const ctx = getContext("ComposedModal");

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('kind' in $$new_props) $$invalidate(11, kind = $$new_props.kind);
    		if ('size' in $$new_props) $$invalidate(1, size = $$new_props.size);
    		if ('expressive' in $$new_props) $$invalidate(12, expressive = $$new_props.expressive);
    		if ('isSelected' in $$new_props) $$invalidate(13, isSelected = $$new_props.isSelected);
    		if ('icon' in $$new_props) $$invalidate(2, icon = $$new_props.icon);
    		if ('iconDescription' in $$new_props) $$invalidate(3, iconDescription = $$new_props.iconDescription);
    		if ('tooltipAlignment' in $$new_props) $$invalidate(14, tooltipAlignment = $$new_props.tooltipAlignment);
    		if ('tooltipPosition' in $$new_props) $$invalidate(15, tooltipPosition = $$new_props.tooltipPosition);
    		if ('as' in $$new_props) $$invalidate(4, as = $$new_props.as);
    		if ('skeleton' in $$new_props) $$invalidate(5, skeleton = $$new_props.skeleton);
    		if ('disabled' in $$new_props) $$invalidate(6, disabled = $$new_props.disabled);
    		if ('href' in $$new_props) $$invalidate(7, href = $$new_props.href);
    		if ('tabindex' in $$new_props) $$invalidate(16, tabindex = $$new_props.tabindex);
    		if ('type' in $$new_props) $$invalidate(17, type = $$new_props.type);
    		if ('ref' in $$new_props) $$invalidate(0, ref = $$new_props.ref);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		kind,
    		size,
    		expressive,
    		isSelected,
    		icon,
    		iconDescription,
    		tooltipAlignment,
    		tooltipPosition,
    		as,
    		skeleton,
    		disabled,
    		href,
    		tabindex,
    		type,
    		ref,
    		getContext,
    		ButtonSkeleton: ButtonSkeleton$1,
    		ctx,
    		hasIconOnly,
    		buttonProps
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('kind' in $$props) $$invalidate(11, kind = $$new_props.kind);
    		if ('size' in $$props) $$invalidate(1, size = $$new_props.size);
    		if ('expressive' in $$props) $$invalidate(12, expressive = $$new_props.expressive);
    		if ('isSelected' in $$props) $$invalidate(13, isSelected = $$new_props.isSelected);
    		if ('icon' in $$props) $$invalidate(2, icon = $$new_props.icon);
    		if ('iconDescription' in $$props) $$invalidate(3, iconDescription = $$new_props.iconDescription);
    		if ('tooltipAlignment' in $$props) $$invalidate(14, tooltipAlignment = $$new_props.tooltipAlignment);
    		if ('tooltipPosition' in $$props) $$invalidate(15, tooltipPosition = $$new_props.tooltipPosition);
    		if ('as' in $$props) $$invalidate(4, as = $$new_props.as);
    		if ('skeleton' in $$props) $$invalidate(5, skeleton = $$new_props.skeleton);
    		if ('disabled' in $$props) $$invalidate(6, disabled = $$new_props.disabled);
    		if ('href' in $$props) $$invalidate(7, href = $$new_props.href);
    		if ('tabindex' in $$props) $$invalidate(16, tabindex = $$new_props.tabindex);
    		if ('type' in $$props) $$invalidate(17, type = $$new_props.type);
    		if ('ref' in $$props) $$invalidate(0, ref = $$new_props.ref);
    		if ('hasIconOnly' in $$props) $$invalidate(8, hasIconOnly = $$new_props.hasIconOnly);
    		if ('buttonProps' in $$props) $$invalidate(9, buttonProps = $$new_props.buttonProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*ref*/ 1) {
    			if (ctx && ref) {
    				ctx.declareRef(ref);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*icon*/ 4) {
    			$$invalidate(8, hasIconOnly = icon && !$$slots.default);
    		}

    		$$invalidate(9, buttonProps = {
    			type: href && !disabled ? undefined : type,
    			tabindex,
    			disabled: disabled === true ? true : undefined,
    			href,
    			"aria-pressed": hasIconOnly && kind === "ghost" && !href
    			? isSelected
    			: undefined,
    			...$$restProps,
    			class: [
    				"bx--btn",
    				expressive && "bx--btn--expressive",
    				(size === "small" && !expressive || size === "sm" && !expressive || size === "small" && !expressive) && "bx--btn--sm",
    				size === "field" && !expressive || size === "md" && !expressive && "bx--btn--md",
    				size === "field" && "bx--btn--field",
    				size === "small" && "bx--btn--sm",
    				size === "lg" && "bx--btn--lg",
    				size === "xl" && "bx--btn--xl",
    				kind && `bx--btn--${kind}`,
    				disabled && "bx--btn--disabled",
    				hasIconOnly && "bx--btn--icon-only",
    				hasIconOnly && "bx--tooltip__trigger",
    				hasIconOnly && "bx--tooltip--a11y",
    				hasIconOnly && tooltipPosition && `bx--btn--icon-only--${tooltipPosition}`,
    				hasIconOnly && tooltipAlignment && `bx--tooltip--align-${tooltipAlignment}`,
    				hasIconOnly && isSelected && kind === "ghost" && "bx--btn--selected",
    				$$restProps.class
    			].filter(Boolean).join(" ")
    		});
    	};

    	return [
    		ref,
    		size,
    		icon,
    		iconDescription,
    		as,
    		skeleton,
    		disabled,
    		href,
    		hasIconOnly,
    		buttonProps,
    		$$restProps,
    		kind,
    		expressive,
    		isSelected,
    		tooltipAlignment,
    		tooltipPosition,
    		tabindex,
    		type,
    		$$scope,
    		slots,
    		click_handler_1,
    		mouseover_handler_1,
    		mouseenter_handler_1,
    		mouseleave_handler_1,
    		click_handler_2,
    		mouseover_handler_2,
    		mouseenter_handler_2,
    		mouseleave_handler_2,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		a_binding,
    		button_binding
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$M,
    			create_fragment$M,
    			safe_not_equal,
    			{
    				kind: 11,
    				size: 1,
    				expressive: 12,
    				isSelected: 13,
    				icon: 2,
    				iconDescription: 3,
    				tooltipAlignment: 14,
    				tooltipPosition: 15,
    				as: 4,
    				skeleton: 5,
    				disabled: 6,
    				href: 7,
    				tabindex: 16,
    				type: 17,
    				ref: 0
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$M.name
    		});
    	}

    	get kind() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kind(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expressive() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expressive(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSelected() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSelected(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDescription() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDescription(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltipAlignment() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltipAlignment(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltipPosition() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltipPosition(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get as() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set as(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skeleton() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skeleton(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Button$1 = Button;

    /* node_modules/carbon-components-svelte/src/Checkbox/InlineCheckbox.svelte generated by Svelte v3.55.1 */

    const file$H = "node_modules/carbon-components-svelte/src/Checkbox/InlineCheckbox.svelte";

    function create_fragment$L(ctx) {
    	let div;
    	let input;
    	let input_checked_value;
    	let input_aria_checked_value;
    	let t;
    	let label;
    	let label_aria_label_value;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		{ type: "checkbox" },
    		{
    			checked: input_checked_value = /*indeterminate*/ ctx[2] ? false : /*checked*/ ctx[1]
    		},
    		{ indeterminate: /*indeterminate*/ ctx[2] },
    		{ id: /*id*/ ctx[4] },
    		/*$$restProps*/ ctx[5],
    		{
    			"aria-checked": input_aria_checked_value = /*indeterminate*/ ctx[2]
    			? undefined
    			: /*checked*/ ctx[1]
    		}
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t = space();
    			label = element("label");
    			set_attributes(input, input_data);
    			toggle_class(input, "bx--checkbox", true);
    			add_location(input, file$H, 21, 2, 530);
    			attr_dev(label, "for", /*id*/ ctx[4]);
    			attr_dev(label, "title", /*title*/ ctx[3]);
    			attr_dev(label, "aria-label", label_aria_label_value = /*$$props*/ ctx[6]['aria-label']);
    			toggle_class(label, "bx--checkbox-label", true);
    			add_location(label, file$H, 32, 2, 808);
    			toggle_class(div, "bx--checkbox--inline", true);
    			add_location(div, file$H, 20, 0, 486);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			if (input.autofocus) input.focus();
    			/*input_binding*/ ctx[8](input);
    			append_dev(div, t);
    			append_dev(div, label);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*change_handler*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				{ type: "checkbox" },
    				dirty & /*indeterminate, checked*/ 6 && input_checked_value !== (input_checked_value = /*indeterminate*/ ctx[2] ? false : /*checked*/ ctx[1]) && { checked: input_checked_value },
    				dirty & /*indeterminate*/ 4 && { indeterminate: /*indeterminate*/ ctx[2] },
    				dirty & /*id*/ 16 && { id: /*id*/ ctx[4] },
    				dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5],
    				dirty & /*indeterminate, checked*/ 6 && input_aria_checked_value !== (input_aria_checked_value = /*indeterminate*/ ctx[2]
    				? undefined
    				: /*checked*/ ctx[1]) && { "aria-checked": input_aria_checked_value }
    			]));

    			toggle_class(input, "bx--checkbox", true);

    			if (dirty & /*id*/ 16) {
    				attr_dev(label, "for", /*id*/ ctx[4]);
    			}

    			if (dirty & /*title*/ 8) {
    				attr_dev(label, "title", /*title*/ ctx[3]);
    			}

    			if (dirty & /*$$props*/ 64 && label_aria_label_value !== (label_aria_label_value = /*$$props*/ ctx[6]['aria-label'])) {
    				attr_dev(label, "aria-label", label_aria_label_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*input_binding*/ ctx[8](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$L.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$L($$self, $$props, $$invalidate) {
    	const omit_props_names = ["checked","indeterminate","title","id","ref"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InlineCheckbox', slots, []);
    	let { checked = false } = $$props;
    	let { indeterminate = false } = $$props;
    	let { title = undefined } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { ref = null } = $$props;

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(6, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('checked' in $$new_props) $$invalidate(1, checked = $$new_props.checked);
    		if ('indeterminate' in $$new_props) $$invalidate(2, indeterminate = $$new_props.indeterminate);
    		if ('title' in $$new_props) $$invalidate(3, title = $$new_props.title);
    		if ('id' in $$new_props) $$invalidate(4, id = $$new_props.id);
    		if ('ref' in $$new_props) $$invalidate(0, ref = $$new_props.ref);
    	};

    	$$self.$capture_state = () => ({ checked, indeterminate, title, id, ref });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(6, $$props = assign(assign({}, $$props), $$new_props));
    		if ('checked' in $$props) $$invalidate(1, checked = $$new_props.checked);
    		if ('indeterminate' in $$props) $$invalidate(2, indeterminate = $$new_props.indeterminate);
    		if ('title' in $$props) $$invalidate(3, title = $$new_props.title);
    		if ('id' in $$props) $$invalidate(4, id = $$new_props.id);
    		if ('ref' in $$props) $$invalidate(0, ref = $$new_props.ref);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);

    	return [
    		ref,
    		checked,
    		indeterminate,
    		title,
    		id,
    		$$restProps,
    		$$props,
    		change_handler,
    		input_binding
    	];
    }

    class InlineCheckbox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$L, create_fragment$L, safe_not_equal, {
    			checked: 1,
    			indeterminate: 2,
    			title: 3,
    			id: 4,
    			ref: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InlineCheckbox",
    			options,
    			id: create_fragment$L.name
    		});
    	}

    	get checked() {
    		throw new Error("<InlineCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<InlineCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get indeterminate() {
    		throw new Error("<InlineCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set indeterminate(value) {
    		throw new Error("<InlineCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<InlineCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<InlineCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<InlineCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<InlineCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<InlineCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<InlineCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var InlineCheckbox$1 = InlineCheckbox;

    /* node_modules/carbon-components-svelte/src/icons/WarningFilled.svelte generated by Svelte v3.55.1 */

    const file$G = "node_modules/carbon-components-svelte/src/icons/WarningFilled.svelte";

    // (24:2) {#if title}
    function create_if_block$u(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$G, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$u.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$K(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let if_block = /*title*/ ctx[1] && create_if_block$u(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14C30,8.3,23.7,2,16,2z M14.9,8h2.2v11h-2.2V8z M16,25\tc-0.8,0-1.5-0.7-1.5-1.5S15.2,22,16,22c0.8,0,1.5,0.7,1.5,1.5S16.8,25,16,25z");
    			add_location(path0, file$G, 24, 2, 579);
    			attr_dev(path1, "fill", "none");
    			attr_dev(path1, "d", "M17.5,23.5c0,0.8-0.7,1.5-1.5,1.5c-0.8,0-1.5-0.7-1.5-1.5S15.2,22,16,22\tC16.8,22,17.5,22.7,17.5,23.5z M17.1,8h-2.2v11h2.2V8z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$G, 26, 10, 777);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$G, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$u(ctx);
    					if_block.c();
    					if_block.m(svg, path0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$K.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$K($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WarningFilled', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class WarningFilled extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$K, create_fragment$K, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WarningFilled",
    			options,
    			id: create_fragment$K.name
    		});
    	}

    	get size() {
    		throw new Error("<WarningFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<WarningFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<WarningFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<WarningFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var WarningFilled$1 = WarningFilled;

    /* node_modules/carbon-components-svelte/src/icons/WarningAltFilled.svelte generated by Svelte v3.55.1 */

    const file$F = "node_modules/carbon-components-svelte/src/icons/WarningAltFilled.svelte";

    // (24:2) {#if title}
    function create_if_block$t(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$F, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$t.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$J(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let if_block = /*title*/ ctx[1] && create_if_block$t(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "d", "M16,26a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,26Zm-1.125-5h2.25V12h-2.25Z");
    			attr_dev(path0, "data-icon-path", "inner-path");
    			add_location(path0, file$F, 24, 2, 579);
    			attr_dev(path1, "d", "M16.002,6.1714h-.004L4.6487,27.9966,4.6506,28H27.3494l.0019-.0034ZM14.875,12h2.25v9h-2.25ZM16,26a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,26Z");
    			add_location(path1, file$F, 27, 39, 722);
    			attr_dev(path2, "d", "M29,30H3a1,1,0,0,1-.8872-1.4614l13-25a1,1,0,0,1,1.7744,0l13,25A1,1,0,0,1,29,30ZM4.6507,28H27.3493l.002-.0033L16.002,6.1714h-.004L4.6487,27.9967Z");
    			add_location(path2, file$F, 29, 10, 886);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$F, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$t(ctx);
    					if_block.c();
    					if_block.m(svg, path0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$J.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$J($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WarningAltFilled', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class WarningAltFilled extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$J, create_fragment$J, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WarningAltFilled",
    			options,
    			id: create_fragment$J.name
    		});
    	}

    	get size() {
    		throw new Error("<WarningAltFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<WarningAltFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<WarningAltFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<WarningAltFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var WarningAltFilled$1 = WarningAltFilled;

    /* node_modules/carbon-components-svelte/src/ListBox/ListBox.svelte generated by Svelte v3.55.1 */

    const file$E = "node_modules/carbon-components-svelte/src/ListBox/ListBox.svelte";

    // (59:0) {#if invalid}
    function create_if_block_1$7(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*invalidText*/ ctx[6]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$E, 59, 2, 1374);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*invalidText*/ 64) set_data_dev(t, /*invalidText*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(59:0) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (62:0) {#if !invalid && warn}
    function create_if_block$s(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*warnText*/ ctx[8]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$E, 62, 2, 1466);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*warnText*/ 256) set_data_dev(t, /*warnText*/ ctx[8]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$s.name,
    		type: "if",
    		source: "(62:0) {#if !invalid && warn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$I(ctx) {
    	let div;
    	let div_data_invalid_value;
    	let t0;
    	let t1;
    	let if_block1_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

    	let div_levels = [
    		{ role: "listbox" },
    		{ tabindex: "-1" },
    		{
    			"data-invalid": div_data_invalid_value = /*invalid*/ ctx[5] || undefined
    		},
    		/*$$restProps*/ ctx[9]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	let if_block0 = /*invalid*/ ctx[5] && create_if_block_1$7(ctx);
    	let if_block1 = !/*invalid*/ ctx[5] && /*warn*/ ctx[7] && create_if_block$s(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--list-box", true);
    			toggle_class(div, "bx--list-box--sm", /*size*/ ctx[0] === 'sm');
    			toggle_class(div, "bx--list-box--xl", /*size*/ ctx[0] === 'xl');
    			toggle_class(div, "bx--list-box--inline", /*type*/ ctx[1] === 'inline');
    			toggle_class(div, "bx--list-box--disabled", /*disabled*/ ctx[4]);
    			toggle_class(div, "bx--list-box--expanded", /*open*/ ctx[2]);
    			toggle_class(div, "bx--list-box--light", /*light*/ ctx[3]);
    			toggle_class(div, "bx--list-box--warning", !/*invalid*/ ctx[5] && /*warn*/ ctx[7]);
    			add_location(div, file$E, 35, 0, 769);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "keydown", /*keydown_handler*/ ctx[12], false, false, false),
    					listen_dev(div, "keydown", keydown_handler_1, false, false, false),
    					listen_dev(div, "click", prevent_default(/*click_handler*/ ctx[13]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				{ role: "listbox" },
    				{ tabindex: "-1" },
    				(!current || dirty & /*invalid*/ 32 && div_data_invalid_value !== (div_data_invalid_value = /*invalid*/ ctx[5] || undefined)) && { "data-invalid": div_data_invalid_value },
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9]
    			]));

    			toggle_class(div, "bx--list-box", true);
    			toggle_class(div, "bx--list-box--sm", /*size*/ ctx[0] === 'sm');
    			toggle_class(div, "bx--list-box--xl", /*size*/ ctx[0] === 'xl');
    			toggle_class(div, "bx--list-box--inline", /*type*/ ctx[1] === 'inline');
    			toggle_class(div, "bx--list-box--disabled", /*disabled*/ ctx[4]);
    			toggle_class(div, "bx--list-box--expanded", /*open*/ ctx[2]);
    			toggle_class(div, "bx--list-box--light", /*light*/ ctx[3]);
    			toggle_class(div, "bx--list-box--warning", !/*invalid*/ ctx[5] && /*warn*/ ctx[7]);

    			if (/*invalid*/ ctx[5]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$7(ctx);
    					if_block0.c();
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!/*invalid*/ ctx[5] && /*warn*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$s(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$I.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const keydown_handler_1 = e => {
    	if (e.key === 'Escape') {
    		e.stopPropagation();
    	}
    };

    function instance$I($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"size","type","open","light","disabled","invalid","invalidText","warn","warnText"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ListBox', slots, ['default']);
    	let { size = undefined } = $$props;
    	let { type = "default" } = $$props;
    	let { open = false } = $$props;
    	let { light = false } = $$props;
    	let { disabled = false } = $$props;
    	let { invalid = false } = $$props;
    	let { invalidText = "" } = $$props;
    	let { warn = false } = $$props;
    	let { warnText = "" } = $$props;

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('type' in $$new_props) $$invalidate(1, type = $$new_props.type);
    		if ('open' in $$new_props) $$invalidate(2, open = $$new_props.open);
    		if ('light' in $$new_props) $$invalidate(3, light = $$new_props.light);
    		if ('disabled' in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ('invalid' in $$new_props) $$invalidate(5, invalid = $$new_props.invalid);
    		if ('invalidText' in $$new_props) $$invalidate(6, invalidText = $$new_props.invalidText);
    		if ('warn' in $$new_props) $$invalidate(7, warn = $$new_props.warn);
    		if ('warnText' in $$new_props) $$invalidate(8, warnText = $$new_props.warnText);
    		if ('$$scope' in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		size,
    		type,
    		open,
    		light,
    		disabled,
    		invalid,
    		invalidText,
    		warn,
    		warnText
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('type' in $$props) $$invalidate(1, type = $$new_props.type);
    		if ('open' in $$props) $$invalidate(2, open = $$new_props.open);
    		if ('light' in $$props) $$invalidate(3, light = $$new_props.light);
    		if ('disabled' in $$props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ('invalid' in $$props) $$invalidate(5, invalid = $$new_props.invalid);
    		if ('invalidText' in $$props) $$invalidate(6, invalidText = $$new_props.invalidText);
    		if ('warn' in $$props) $$invalidate(7, warn = $$new_props.warn);
    		if ('warnText' in $$props) $$invalidate(8, warnText = $$new_props.warnText);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		size,
    		type,
    		open,
    		light,
    		disabled,
    		invalid,
    		invalidText,
    		warn,
    		warnText,
    		$$restProps,
    		$$scope,
    		slots,
    		keydown_handler,
    		click_handler
    	];
    }

    class ListBox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$I, create_fragment$I, safe_not_equal, {
    			size: 0,
    			type: 1,
    			open: 2,
    			light: 3,
    			disabled: 4,
    			invalid: 5,
    			invalidText: 6,
    			warn: 7,
    			warnText: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListBox",
    			options,
    			id: create_fragment$I.name
    		});
    	}

    	get size() {
    		throw new Error("<ListBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ListBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<ListBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<ListBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<ListBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<ListBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<ListBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<ListBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<ListBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<ListBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<ListBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<ListBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalidText() {
    		throw new Error("<ListBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalidText(value) {
    		throw new Error("<ListBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warn() {
    		throw new Error("<ListBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warn(value) {
    		throw new Error("<ListBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warnText() {
    		throw new Error("<ListBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warnText(value) {
    		throw new Error("<ListBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ListBox$1 = ListBox;

    /* node_modules/carbon-components-svelte/src/ListBox/ListBoxMenu.svelte generated by Svelte v3.55.1 */

    const file$D = "node_modules/carbon-components-svelte/src/ListBox/ListBoxMenu.svelte";

    function create_fragment$H(ctx) {
    	let div;
    	let div_id_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	let div_levels = [
    		{ role: "listbox" },
    		{
    			id: div_id_value = "menu-" + /*id*/ ctx[1]
    		},
    		/*$$restProps*/ ctx[2]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--list-box__menu", true);
    			add_location(div, file$D, 8, 0, 194);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[6](div);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "scroll", /*scroll_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				{ role: "listbox" },
    				(!current || dirty & /*id*/ 2 && div_id_value !== (div_id_value = "menu-" + /*id*/ ctx[1])) && { id: div_id_value },
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2]
    			]));

    			toggle_class(div, "bx--list-box__menu", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[6](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$H.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$H($$self, $$props, $$invalidate) {
    	const omit_props_names = ["id","ref"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ListBoxMenu', slots, ['default']);
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { ref = null } = $$props;

    	function scroll_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('id' in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ('ref' in $$new_props) $$invalidate(0, ref = $$new_props.ref);
    		if ('$$scope' in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ id, ref });

    	$$self.$inject_state = $$new_props => {
    		if ('id' in $$props) $$invalidate(1, id = $$new_props.id);
    		if ('ref' in $$props) $$invalidate(0, ref = $$new_props.ref);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ref, id, $$restProps, $$scope, slots, scroll_handler, div_binding];
    }

    class ListBoxMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$H, create_fragment$H, safe_not_equal, { id: 1, ref: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListBoxMenu",
    			options,
    			id: create_fragment$H.name
    		});
    	}

    	get id() {
    		throw new Error("<ListBoxMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<ListBoxMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<ListBoxMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<ListBoxMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ListBoxMenu$1 = ListBoxMenu;

    /* node_modules/carbon-components-svelte/src/icons/ChevronDown.svelte generated by Svelte v3.55.1 */

    const file$C = "node_modules/carbon-components-svelte/src/icons/ChevronDown.svelte";

    // (24:2) {#if title}
    function create_if_block$r(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$C, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$r.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$G(ctx) {
    	let svg;
    	let path;
    	let if_block = /*title*/ ctx[1] && create_if_block$r(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path = svg_element("path");
    			attr_dev(path, "d", "M16 22L6 12 7.4 10.6 16 19.2 24.6 10.6 26 12z");
    			add_location(path, file$C, 24, 2, 579);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$C, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$r(ctx);
    					if_block.c();
    					if_block.m(svg, path);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$G.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$G($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChevronDown', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class ChevronDown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$G, create_fragment$G, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChevronDown",
    			options,
    			id: create_fragment$G.name
    		});
    	}

    	get size() {
    		throw new Error("<ChevronDown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ChevronDown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ChevronDown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ChevronDown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ChevronDown$1 = ChevronDown;

    /* node_modules/carbon-components-svelte/src/ListBox/ListBoxMenuIcon.svelte generated by Svelte v3.55.1 */
    const file$B = "node_modules/carbon-components-svelte/src/ListBox/ListBoxMenuIcon.svelte";

    function create_fragment$F(ctx) {
    	let div;
    	let chevrondown;
    	let current;
    	let mounted;
    	let dispose;

    	chevrondown = new ChevronDown$1({
    			props: {
    				"aria-label": /*description*/ ctx[1],
    				title: /*description*/ ctx[1]
    			},
    			$$inline: true
    		});

    	let div_levels = [/*$$restProps*/ ctx[2]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(chevrondown.$$.fragment);
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--list-box__menu-icon", true);
    			toggle_class(div, "bx--list-box__menu-icon--open", /*open*/ ctx[0]);
    			add_location(div, file$B, 29, 0, 799);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(chevrondown, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", prevent_default(/*click_handler*/ ctx[6]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const chevrondown_changes = {};
    			if (dirty & /*description*/ 2) chevrondown_changes["aria-label"] = /*description*/ ctx[1];
    			if (dirty & /*description*/ 2) chevrondown_changes.title = /*description*/ ctx[1];
    			chevrondown.$set(chevrondown_changes);
    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2]]));
    			toggle_class(div, "bx--list-box__menu-icon", true);
    			toggle_class(div, "bx--list-box__menu-icon--open", /*open*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chevrondown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chevrondown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(chevrondown);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$F.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$F($$self, $$props, $$invalidate) {
    	let translationId;
    	let description;
    	const omit_props_names = ["open","translationIds","translateWithId"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ListBoxMenuIcon', slots, []);
    	let { open = false } = $$props;
    	const translationIds = { close: "close", open: "open" };
    	let { translateWithId = id => defaultTranslations[id] } = $$props;

    	const defaultTranslations = {
    		[translationIds.close]: "Close menu",
    		[translationIds.open]: "Open menu"
    	};

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('open' in $$new_props) $$invalidate(0, open = $$new_props.open);
    		if ('translateWithId' in $$new_props) $$invalidate(4, translateWithId = $$new_props.translateWithId);
    	};

    	$$self.$capture_state = () => ({
    		open,
    		translationIds,
    		translateWithId,
    		ChevronDown: ChevronDown$1,
    		defaultTranslations,
    		translationId,
    		description
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('open' in $$props) $$invalidate(0, open = $$new_props.open);
    		if ('translateWithId' in $$props) $$invalidate(4, translateWithId = $$new_props.translateWithId);
    		if ('translationId' in $$props) $$invalidate(5, translationId = $$new_props.translationId);
    		if ('description' in $$props) $$invalidate(1, description = $$new_props.description);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*open*/ 1) {
    			$$invalidate(5, translationId = open ? translationIds.close : translationIds.open);
    		}

    		if ($$self.$$.dirty & /*translateWithId, translationId*/ 48) {
    			$$invalidate(1, description = translateWithId?.(translationId) ?? defaultTranslations[translationId]);
    		}
    	};

    	return [
    		open,
    		description,
    		$$restProps,
    		translationIds,
    		translateWithId,
    		translationId,
    		click_handler
    	];
    }

    class ListBoxMenuIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$F, create_fragment$F, safe_not_equal, {
    			open: 0,
    			translationIds: 3,
    			translateWithId: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListBoxMenuIcon",
    			options,
    			id: create_fragment$F.name
    		});
    	}

    	get open() {
    		throw new Error("<ListBoxMenuIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<ListBoxMenuIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translationIds() {
    		return this.$$.ctx[3];
    	}

    	set translationIds(value) {
    		throw new Error("<ListBoxMenuIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translateWithId() {
    		throw new Error("<ListBoxMenuIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set translateWithId(value) {
    		throw new Error("<ListBoxMenuIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ListBoxMenuIcon$1 = ListBoxMenuIcon;

    /* node_modules/carbon-components-svelte/src/ListBox/ListBoxMenuItem.svelte generated by Svelte v3.55.1 */

    const file$A = "node_modules/carbon-components-svelte/src/ListBox/ListBoxMenuItem.svelte";

    function create_fragment$E(ctx) {
    	let div1;
    	let div0;
    	let div1_disabled_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	let div1_levels = [
    		{ role: "option" },
    		{ "aria-selected": /*active*/ ctx[0] },
    		{
    			disabled: div1_disabled_value = /*disabled*/ ctx[2] ? true : undefined
    		},
    		/*$$restProps*/ ctx[5]
    	];

    	let div1_data = {};

    	for (let i = 0; i < div1_levels.length; i += 1) {
    		div1_data = assign(div1_data, div1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "title", /*title*/ ctx[4]);
    			toggle_class(div0, "bx--list-box__menu-item__option", true);
    			add_location(div0, file$A, 32, 2, 897);
    			set_attributes(div1, div1_data);
    			toggle_class(div1, "bx--list-box__menu-item", true);
    			toggle_class(div1, "bx--list-box__menu-item--active", /*active*/ ctx[0]);
    			toggle_class(div1, "bx--list-box__menu-item--highlighted", /*highlighted*/ ctx[1] || /*active*/ ctx[0]);
    			add_location(div1, file$A, 20, 0, 577);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div0_binding*/ ctx[12](div0);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*click_handler*/ ctx[9], false, false, false),
    					listen_dev(div1, "mouseenter", /*mouseenter_handler*/ ctx[10], false, false, false),
    					listen_dev(div1, "mouseleave", /*mouseleave_handler*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*title*/ 16) {
    				attr_dev(div0, "title", /*title*/ ctx[4]);
    			}

    			set_attributes(div1, div1_data = get_spread_update(div1_levels, [
    				{ role: "option" },
    				(!current || dirty & /*active*/ 1) && { "aria-selected": /*active*/ ctx[0] },
    				(!current || dirty & /*disabled*/ 4 && div1_disabled_value !== (div1_disabled_value = /*disabled*/ ctx[2] ? true : undefined)) && { disabled: div1_disabled_value },
    				dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5]
    			]));

    			toggle_class(div1, "bx--list-box__menu-item", true);
    			toggle_class(div1, "bx--list-box__menu-item--active", /*active*/ ctx[0]);
    			toggle_class(div1, "bx--list-box__menu-item--highlighted", /*highlighted*/ ctx[1] || /*active*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			/*div0_binding*/ ctx[12](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$E.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$E($$self, $$props, $$invalidate) {
    	let isTruncated;
    	let title;
    	const omit_props_names = ["active","highlighted","disabled"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ListBoxMenuItem', slots, ['default']);
    	let { active = false } = $$props;
    	let { highlighted = false } = $$props;
    	let { disabled = false } = $$props;
    	let ref = null;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(3, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('active' in $$new_props) $$invalidate(0, active = $$new_props.active);
    		if ('highlighted' in $$new_props) $$invalidate(1, highlighted = $$new_props.highlighted);
    		if ('disabled' in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		active,
    		highlighted,
    		disabled,
    		ref,
    		isTruncated,
    		title
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('active' in $$props) $$invalidate(0, active = $$new_props.active);
    		if ('highlighted' in $$props) $$invalidate(1, highlighted = $$new_props.highlighted);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('ref' in $$props) $$invalidate(3, ref = $$new_props.ref);
    		if ('isTruncated' in $$props) $$invalidate(6, isTruncated = $$new_props.isTruncated);
    		if ('title' in $$props) $$invalidate(4, title = $$new_props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*ref*/ 8) {
    			$$invalidate(6, isTruncated = ref?.offsetWidth < ref?.scrollWidth);
    		}

    		if ($$self.$$.dirty & /*isTruncated, ref*/ 72) {
    			$$invalidate(4, title = isTruncated ? ref?.innerText : undefined);
    		}

    		if ($$self.$$.dirty & /*highlighted, ref*/ 10) {
    			if (highlighted && ref && !ref.matches(":hover")) {
    				// Scroll highlighted item into view if using keyboard navigation
    				ref.scrollIntoView({ block: "nearest" });
    			}
    		}
    	};

    	return [
    		active,
    		highlighted,
    		disabled,
    		ref,
    		title,
    		$$restProps,
    		isTruncated,
    		$$scope,
    		slots,
    		click_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		div0_binding
    	];
    }

    class ListBoxMenuItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$E, create_fragment$E, safe_not_equal, { active: 0, highlighted: 1, disabled: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListBoxMenuItem",
    			options,
    			id: create_fragment$E.name
    		});
    	}

    	get active() {
    		throw new Error("<ListBoxMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<ListBoxMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get highlighted() {
    		throw new Error("<ListBoxMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set highlighted(value) {
    		throw new Error("<ListBoxMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<ListBoxMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<ListBoxMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ListBoxMenuItem$1 = ListBoxMenuItem;

    /* node_modules/carbon-components-svelte/src/icons/Close.svelte generated by Svelte v3.55.1 */

    const file$z = "node_modules/carbon-components-svelte/src/icons/Close.svelte";

    // (24:2) {#if title}
    function create_if_block$q(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$z, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$q.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$D(ctx) {
    	let svg;
    	let path;
    	let if_block = /*title*/ ctx[1] && create_if_block$q(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path = svg_element("path");
    			attr_dev(path, "d", "M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z");
    			add_location(path, file$z, 24, 2, 579);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$z, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$q(ctx);
    					if_block.c();
    					if_block.m(svg, path);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$D.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$D($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Close', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class Close extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$D, create_fragment$D, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Close",
    			options,
    			id: create_fragment$D.name
    		});
    	}

    	get size() {
    		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Close$1 = Close;

    /** A set of stores indicating whether a modal is open. */
    const stores = new Set();

    /** Store for the number of open modals. */
    const modalsOpen = writable(0);

    const updateModalsOpen = () =>
      modalsOpen.set([...stores].filter((open) => get_store_value(open)).length);

    /**
     * Adds a modal's store to the open modal tracking.
     * Has to be called during component initialization.
     * Modal is automatically removed on destroy.
     * @param {import('svelte/store').Readable<boolean>} openStore
     *   Store that indicates whether the modal is opened.
     */
    const trackModal = (openStore) =>
      onMount(() => {
        stores.add(openStore);
        const unsubscribe = openStore.subscribe(updateModalsOpen);

        return () => {
          unsubscribe();
          stores.delete(openStore);

          updateModalsOpen();
        };
      });

    modalsOpen.subscribe((openCount) => {
      if (typeof document !== "undefined")
        document.body.classList.toggle("bx--body--with-modal-open", openCount > 0);
    });

    /* node_modules/carbon-components-svelte/src/RadioButton/RadioButton.svelte generated by Svelte v3.55.1 */
    const file$y = "node_modules/carbon-components-svelte/src/RadioButton/RadioButton.svelte";
    const get_labelText_slot_changes$3 = dirty => ({});
    const get_labelText_slot_context$3 = ctx => ({});

    // (74:4) {#if labelText || $$slots.labelText}
    function create_if_block$p(ctx) {
    	let span;
    	let current;
    	const labelText_slot_template = /*#slots*/ ctx[16].labelText;
    	const labelText_slot = create_slot(labelText_slot_template, ctx, /*$$scope*/ ctx[15], get_labelText_slot_context$3);
    	const labelText_slot_or_fallback = labelText_slot || fallback_block$9(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.c();
    			toggle_class(span, "bx--visually-hidden", /*hideLabel*/ ctx[7]);
    			add_location(span, file$y, 74, 6, 1826);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (labelText_slot_or_fallback) {
    				labelText_slot_or_fallback.m(span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (labelText_slot) {
    				if (labelText_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						labelText_slot,
    						labelText_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(labelText_slot_template, /*$$scope*/ ctx[15], dirty, get_labelText_slot_changes$3),
    						get_labelText_slot_context$3
    					);
    				}
    			} else {
    				if (labelText_slot_or_fallback && labelText_slot_or_fallback.p && (!current || dirty & /*labelText*/ 64)) {
    					labelText_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			if (!current || dirty & /*hideLabel*/ 128) {
    				toggle_class(span, "bx--visually-hidden", /*hideLabel*/ ctx[7]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(labelText_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(labelText_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$p.name,
    		type: "if",
    		source: "(74:4) {#if labelText || $$slots.labelText}",
    		ctx
    	});

    	return block;
    }

    // (76:31)
    function fallback_block$9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*labelText*/ ctx[6]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*labelText*/ 64) set_data_dev(t, /*labelText*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$9.name,
    		type: "fallback",
    		source: "(76:31)            ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$C(ctx) {
    	let div;
    	let input;
    	let t0;
    	let label;
    	let span;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = (/*labelText*/ ctx[6] || /*$$slots*/ ctx[13].labelText) && create_if_block$p(ctx);
    	let div_levels = [/*$$restProps*/ ctx[12]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			span = element("span");
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "id", /*id*/ ctx[8]);
    			attr_dev(input, "name", /*name*/ ctx[9]);
    			input.checked = /*checked*/ ctx[0];
    			input.disabled = /*disabled*/ ctx[3];
    			input.required = /*required*/ ctx[4];
    			input.value = /*value*/ ctx[2];
    			toggle_class(input, "bx--radio-button", true);
    			add_location(input, file$y, 54, 2, 1344);
    			toggle_class(span, "bx--radio-button__appearance", true);
    			add_location(span, file$y, 72, 4, 1721);
    			attr_dev(label, "for", /*id*/ ctx[8]);
    			toggle_class(label, "bx--radio-button__label", true);
    			add_location(label, file$y, 71, 2, 1659);
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--radio-button-wrapper", true);
    			toggle_class(div, "bx--radio-button-wrapper--label-left", /*labelPosition*/ ctx[5] === 'left');
    			add_location(div, file$y, 49, 0, 1200);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			/*input_binding*/ ctx[18](input);
    			append_dev(div, t0);
    			append_dev(div, label);
    			append_dev(label, span);
    			append_dev(label, t1);
    			if (if_block) if_block.m(label, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*change_handler*/ ctx[17], false, false, false),
    					listen_dev(input, "change", /*change_handler_1*/ ctx[19], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*id*/ 256) {
    				attr_dev(input, "id", /*id*/ ctx[8]);
    			}

    			if (!current || dirty & /*name*/ 512) {
    				attr_dev(input, "name", /*name*/ ctx[9]);
    			}

    			if (!current || dirty & /*checked*/ 1) {
    				prop_dev(input, "checked", /*checked*/ ctx[0]);
    			}

    			if (!current || dirty & /*disabled*/ 8) {
    				prop_dev(input, "disabled", /*disabled*/ ctx[3]);
    			}

    			if (!current || dirty & /*required*/ 16) {
    				prop_dev(input, "required", /*required*/ ctx[4]);
    			}

    			if (!current || dirty & /*value*/ 4) {
    				prop_dev(input, "value", /*value*/ ctx[2]);
    			}

    			if (/*labelText*/ ctx[6] || /*$$slots*/ ctx[13].labelText) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*labelText, $$slots*/ 8256) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$p(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(label, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*id*/ 256) {
    				attr_dev(label, "for", /*id*/ ctx[8]);
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12]]));
    			toggle_class(div, "bx--radio-button-wrapper", true);
    			toggle_class(div, "bx--radio-button-wrapper--label-left", /*labelPosition*/ ctx[5] === 'left');
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*input_binding*/ ctx[18](null);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$C.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$C($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"value","checked","disabled","required","labelPosition","labelText","hideLabel","id","name","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $selectedValue;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RadioButton', slots, ['labelText']);
    	const $$slots = compute_slots(slots);
    	let { value = "" } = $$props;
    	let { checked = false } = $$props;
    	let { disabled = false } = $$props;
    	let { required = false } = $$props;
    	let { labelPosition = "right" } = $$props;
    	let { labelText = "" } = $$props;
    	let { hideLabel = false } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { name = "" } = $$props;
    	let { ref = null } = $$props;
    	const ctx = getContext("RadioButtonGroup");

    	const selectedValue = ctx
    	? ctx.selectedValue
    	: writable(checked ? value : undefined);

    	validate_store(selectedValue, 'selectedValue');
    	component_subscribe($$self, selectedValue, value => $$invalidate(14, $selectedValue = value));

    	if (ctx) {
    		ctx.add({ id, checked, disabled, value });
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	const change_handler_1 = () => {
    		if (ctx) {
    			ctx.update(value);
    		}
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('value' in $$new_props) $$invalidate(2, value = $$new_props.value);
    		if ('checked' in $$new_props) $$invalidate(0, checked = $$new_props.checked);
    		if ('disabled' in $$new_props) $$invalidate(3, disabled = $$new_props.disabled);
    		if ('required' in $$new_props) $$invalidate(4, required = $$new_props.required);
    		if ('labelPosition' in $$new_props) $$invalidate(5, labelPosition = $$new_props.labelPosition);
    		if ('labelText' in $$new_props) $$invalidate(6, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$new_props) $$invalidate(7, hideLabel = $$new_props.hideLabel);
    		if ('id' in $$new_props) $$invalidate(8, id = $$new_props.id);
    		if ('name' in $$new_props) $$invalidate(9, name = $$new_props.name);
    		if ('ref' in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		value,
    		checked,
    		disabled,
    		required,
    		labelPosition,
    		labelText,
    		hideLabel,
    		id,
    		name,
    		ref,
    		getContext,
    		writable,
    		ctx,
    		selectedValue,
    		$selectedValue
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('value' in $$props) $$invalidate(2, value = $$new_props.value);
    		if ('checked' in $$props) $$invalidate(0, checked = $$new_props.checked);
    		if ('disabled' in $$props) $$invalidate(3, disabled = $$new_props.disabled);
    		if ('required' in $$props) $$invalidate(4, required = $$new_props.required);
    		if ('labelPosition' in $$props) $$invalidate(5, labelPosition = $$new_props.labelPosition);
    		if ('labelText' in $$props) $$invalidate(6, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$props) $$invalidate(7, hideLabel = $$new_props.hideLabel);
    		if ('id' in $$props) $$invalidate(8, id = $$new_props.id);
    		if ('name' in $$props) $$invalidate(9, name = $$new_props.name);
    		if ('ref' in $$props) $$invalidate(1, ref = $$new_props.ref);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$selectedValue, value*/ 16388) {
    			$$invalidate(0, checked = $selectedValue === value);
    		}
    	};

    	return [
    		checked,
    		ref,
    		value,
    		disabled,
    		required,
    		labelPosition,
    		labelText,
    		hideLabel,
    		id,
    		name,
    		ctx,
    		selectedValue,
    		$$restProps,
    		$$slots,
    		$selectedValue,
    		$$scope,
    		slots,
    		change_handler,
    		input_binding,
    		change_handler_1
    	];
    }

    class RadioButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$C, create_fragment$C, safe_not_equal, {
    			value: 2,
    			checked: 0,
    			disabled: 3,
    			required: 4,
    			labelPosition: 5,
    			labelText: 6,
    			hideLabel: 7,
    			id: 8,
    			name: 9,
    			ref: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RadioButton",
    			options,
    			id: create_fragment$C.name
    		});
    	}

    	get value() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checked() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get required() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set required(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelPosition() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelPosition(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelText() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelText(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideLabel() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideLabel(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var RadioButton$1 = RadioButton;

    /* node_modules/carbon-components-svelte/src/DataTable/Table.svelte generated by Svelte v3.55.1 */

    const file$x = "node_modules/carbon-components-svelte/src/DataTable/Table.svelte";

    // (44:0) {:else}
    function create_else_block$7(ctx) {
    	let table;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);
    	let table_levels = [/*$$restProps*/ ctx[6], { style: /*tableStyle*/ ctx[5] }];
    	let table_data = {};

    	for (let i = 0; i < table_levels.length; i += 1) {
    		table_data = assign(table_data, table_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			if (default_slot) default_slot.c();
    			set_attributes(table, table_data);
    			toggle_class(table, "bx--data-table", true);
    			toggle_class(table, "bx--data-table--compact", /*size*/ ctx[0] === 'compact');
    			toggle_class(table, "bx--data-table--short", /*size*/ ctx[0] === 'short');
    			toggle_class(table, "bx--data-table--tall", /*size*/ ctx[0] === 'tall');
    			toggle_class(table, "bx--data-table--md", /*size*/ ctx[0] === 'medium');
    			toggle_class(table, "bx--data-table--sort", /*sortable*/ ctx[3]);
    			toggle_class(table, "bx--data-table--zebra", /*zebra*/ ctx[1]);
    			toggle_class(table, "bx--data-table--static", /*useStaticWidth*/ ctx[2]);
    			toggle_class(table, "bx--data-table--sticky-header", /*stickyHeader*/ ctx[4]);
    			add_location(table, file$x, 44, 2, 1235);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(table, table_data = get_spread_update(table_levels, [
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6],
    				(!current || dirty & /*tableStyle*/ 32) && { style: /*tableStyle*/ ctx[5] }
    			]));

    			toggle_class(table, "bx--data-table", true);
    			toggle_class(table, "bx--data-table--compact", /*size*/ ctx[0] === 'compact');
    			toggle_class(table, "bx--data-table--short", /*size*/ ctx[0] === 'short');
    			toggle_class(table, "bx--data-table--tall", /*size*/ ctx[0] === 'tall');
    			toggle_class(table, "bx--data-table--md", /*size*/ ctx[0] === 'medium');
    			toggle_class(table, "bx--data-table--sort", /*sortable*/ ctx[3]);
    			toggle_class(table, "bx--data-table--zebra", /*zebra*/ ctx[1]);
    			toggle_class(table, "bx--data-table--static", /*useStaticWidth*/ ctx[2]);
    			toggle_class(table, "bx--data-table--sticky-header", /*stickyHeader*/ ctx[4]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(44:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (27:0) {#if stickyHeader}
    function create_if_block$o(ctx) {
    	let section;
    	let table;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);
    	let section_levels = [/*$$restProps*/ ctx[6]];
    	let section_data = {};

    	for (let i = 0; i < section_levels.length; i += 1) {
    		section_data = assign(section_data, section_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			table = element("table");
    			if (default_slot) default_slot.c();
    			attr_dev(table, "style", /*tableStyle*/ ctx[5]);
    			toggle_class(table, "bx--data-table", true);
    			toggle_class(table, "bx--data-table--compact", /*size*/ ctx[0] === 'compact');
    			toggle_class(table, "bx--data-table--short", /*size*/ ctx[0] === 'short');
    			toggle_class(table, "bx--data-table--tall", /*size*/ ctx[0] === 'tall');
    			toggle_class(table, "bx--data-table--md", /*size*/ ctx[0] === 'medium');
    			toggle_class(table, "bx--data-table--sort", /*sortable*/ ctx[3]);
    			toggle_class(table, "bx--data-table--zebra", /*zebra*/ ctx[1]);
    			toggle_class(table, "bx--data-table--static", /*useStaticWidth*/ ctx[2]);
    			toggle_class(table, "bx--data-table--sticky-header", /*stickyHeader*/ ctx[4]);
    			add_location(table, file$x, 28, 4, 685);
    			set_attributes(section, section_data);
    			toggle_class(section, "bx--data-table_inner-container", true);
    			add_location(section, file$x, 27, 2, 608);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, table);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*tableStyle*/ 32) {
    				attr_dev(table, "style", /*tableStyle*/ ctx[5]);
    			}

    			if (!current || dirty & /*size*/ 1) {
    				toggle_class(table, "bx--data-table--compact", /*size*/ ctx[0] === 'compact');
    			}

    			if (!current || dirty & /*size*/ 1) {
    				toggle_class(table, "bx--data-table--short", /*size*/ ctx[0] === 'short');
    			}

    			if (!current || dirty & /*size*/ 1) {
    				toggle_class(table, "bx--data-table--tall", /*size*/ ctx[0] === 'tall');
    			}

    			if (!current || dirty & /*size*/ 1) {
    				toggle_class(table, "bx--data-table--md", /*size*/ ctx[0] === 'medium');
    			}

    			if (!current || dirty & /*sortable*/ 8) {
    				toggle_class(table, "bx--data-table--sort", /*sortable*/ ctx[3]);
    			}

    			if (!current || dirty & /*zebra*/ 2) {
    				toggle_class(table, "bx--data-table--zebra", /*zebra*/ ctx[1]);
    			}

    			if (!current || dirty & /*useStaticWidth*/ 4) {
    				toggle_class(table, "bx--data-table--static", /*useStaticWidth*/ ctx[2]);
    			}

    			if (!current || dirty & /*stickyHeader*/ 16) {
    				toggle_class(table, "bx--data-table--sticky-header", /*stickyHeader*/ ctx[4]);
    			}

    			set_attributes(section, section_data = get_spread_update(section_levels, [dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]]));
    			toggle_class(section, "bx--data-table_inner-container", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$o.name,
    		type: "if",
    		source: "(27:0) {#if stickyHeader}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$B(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$o, create_else_block$7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*stickyHeader*/ ctx[4]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
    	const omit_props_names = ["size","zebra","useStaticWidth","sortable","stickyHeader","tableStyle"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Table', slots, ['default']);
    	let { size = undefined } = $$props;
    	let { zebra = false } = $$props;
    	let { useStaticWidth = false } = $$props;
    	let { sortable = false } = $$props;
    	let { stickyHeader = false } = $$props;
    	let { tableStyle = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('zebra' in $$new_props) $$invalidate(1, zebra = $$new_props.zebra);
    		if ('useStaticWidth' in $$new_props) $$invalidate(2, useStaticWidth = $$new_props.useStaticWidth);
    		if ('sortable' in $$new_props) $$invalidate(3, sortable = $$new_props.sortable);
    		if ('stickyHeader' in $$new_props) $$invalidate(4, stickyHeader = $$new_props.stickyHeader);
    		if ('tableStyle' in $$new_props) $$invalidate(5, tableStyle = $$new_props.tableStyle);
    		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		size,
    		zebra,
    		useStaticWidth,
    		sortable,
    		stickyHeader,
    		tableStyle
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('zebra' in $$props) $$invalidate(1, zebra = $$new_props.zebra);
    		if ('useStaticWidth' in $$props) $$invalidate(2, useStaticWidth = $$new_props.useStaticWidth);
    		if ('sortable' in $$props) $$invalidate(3, sortable = $$new_props.sortable);
    		if ('stickyHeader' in $$props) $$invalidate(4, stickyHeader = $$new_props.stickyHeader);
    		if ('tableStyle' in $$props) $$invalidate(5, tableStyle = $$new_props.tableStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		size,
    		zebra,
    		useStaticWidth,
    		sortable,
    		stickyHeader,
    		tableStyle,
    		$$restProps,
    		$$scope,
    		slots
    	];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$B, create_fragment$B, safe_not_equal, {
    			size: 0,
    			zebra: 1,
    			useStaticWidth: 2,
    			sortable: 3,
    			stickyHeader: 4,
    			tableStyle: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$B.name
    		});
    	}

    	get size() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zebra() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zebra(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get useStaticWidth() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set useStaticWidth(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sortable() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortable(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stickyHeader() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stickyHeader(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tableStyle() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tableStyle(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Table$1 = Table;

    /* node_modules/carbon-components-svelte/src/DataTable/TableBody.svelte generated by Svelte v3.55.1 */

    const file$w = "node_modules/carbon-components-svelte/src/DataTable/TableBody.svelte";

    function create_fragment$A(ctx) {
    	let tbody;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	let tbody_levels = [{ "aria-live": "polite" }, /*$$restProps*/ ctx[0]];
    	let tbody_data = {};

    	for (let i = 0; i < tbody_levels.length; i += 1) {
    		tbody_data = assign(tbody_data, tbody_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			tbody = element("tbody");
    			if (default_slot) default_slot.c();
    			set_attributes(tbody, tbody_data);
    			add_location(tbody, file$w, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tbody, anchor);

    			if (default_slot) {
    				default_slot.m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(tbody, tbody_data = get_spread_update(tbody_levels, [
    				{ "aria-live": "polite" },
    				dirty & /*$$restProps*/ 1 && /*$$restProps*/ ctx[0]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tbody);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableBody', slots, ['default']);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(0, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('$$scope' in $$new_props) $$invalidate(1, $$scope = $$new_props.$$scope);
    	};

    	return [$$restProps, $$scope, slots];
    }

    class TableBody extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableBody",
    			options,
    			id: create_fragment$A.name
    		});
    	}
    }

    var TableBody$1 = TableBody;

    /* node_modules/carbon-components-svelte/src/DataTable/TableCell.svelte generated by Svelte v3.55.1 */

    const file$v = "node_modules/carbon-components-svelte/src/DataTable/TableCell.svelte";

    function create_fragment$z(ctx) {
    	let td;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	let td_levels = [/*$$restProps*/ ctx[0]];
    	let td_data = {};

    	for (let i = 0; i < td_levels.length; i += 1) {
    		td_data = assign(td_data, td_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			if (default_slot) default_slot.c();
    			set_attributes(td, td_data);
    			add_location(td, file$v, 1, 0, 57);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);

    			if (default_slot) {
    				default_slot.m(td, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(td, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(td, "mouseover", /*mouseover_handler*/ ctx[4], false, false, false),
    					listen_dev(td, "mouseenter", /*mouseenter_handler*/ ctx[5], false, false, false),
    					listen_dev(td, "mouseleave", /*mouseleave_handler*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(td, td_data = get_spread_update(td_levels, [dirty & /*$$restProps*/ 1 && /*$$restProps*/ ctx[0]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableCell', slots, ['default']);

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(0, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('$$scope' in $$new_props) $$invalidate(1, $$scope = $$new_props.$$scope);
    	};

    	return [
    		$$restProps,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class TableCell extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableCell",
    			options,
    			id: create_fragment$z.name
    		});
    	}
    }

    var TableCell$1 = TableCell;

    /* node_modules/carbon-components-svelte/src/DataTable/TableContainer.svelte generated by Svelte v3.55.1 */

    const file$u = "node_modules/carbon-components-svelte/src/DataTable/TableContainer.svelte";

    // (21:2) {#if title}
    function create_if_block$n(ctx) {
    	let div;
    	let h4;
    	let t0;
    	let t1;
    	let p;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			p = element("p");
    			t2 = text(/*description*/ ctx[1]);
    			toggle_class(h4, "bx--data-table-header__title", true);
    			add_location(h4, file$u, 22, 6, 585);
    			toggle_class(p, "bx--data-table-header__description", true);
    			add_location(p, file$u, 23, 6, 652);
    			toggle_class(div, "bx--data-table-header", true);
    			add_location(div, file$u, 21, 4, 536);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(h4, t0);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    			if (dirty & /*description*/ 2) set_data_dev(t2, /*description*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$n.name,
    		type: "if",
    		source: "(21:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$y(ctx) {
    	let div;
    	let t;
    	let current;
    	let if_block = /*title*/ ctx[0] && create_if_block$n(ctx);
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let div_levels = [/*$$restProps*/ ctx[4]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--data-table-container", true);
    			toggle_class(div, "bx--data-table-container--static", /*useStaticWidth*/ ctx[3]);
    			toggle_class(div, "bx--data-table--max-width", /*stickyHeader*/ ctx[2]);
    			add_location(div, file$u, 14, 0, 339);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$n(ctx);
    					if_block.c();
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]]));
    			toggle_class(div, "bx--data-table-container", true);
    			toggle_class(div, "bx--data-table-container--static", /*useStaticWidth*/ ctx[3]);
    			toggle_class(div, "bx--data-table--max-width", /*stickyHeader*/ ctx[2]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	const omit_props_names = ["title","description","stickyHeader","useStaticWidth"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableContainer', slots, ['default']);
    	let { title = "" } = $$props;
    	let { description = "" } = $$props;
    	let { stickyHeader = false } = $$props;
    	let { useStaticWidth = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('title' in $$new_props) $$invalidate(0, title = $$new_props.title);
    		if ('description' in $$new_props) $$invalidate(1, description = $$new_props.description);
    		if ('stickyHeader' in $$new_props) $$invalidate(2, stickyHeader = $$new_props.stickyHeader);
    		if ('useStaticWidth' in $$new_props) $$invalidate(3, useStaticWidth = $$new_props.useStaticWidth);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		title,
    		description,
    		stickyHeader,
    		useStaticWidth
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('title' in $$props) $$invalidate(0, title = $$new_props.title);
    		if ('description' in $$props) $$invalidate(1, description = $$new_props.description);
    		if ('stickyHeader' in $$props) $$invalidate(2, stickyHeader = $$new_props.stickyHeader);
    		if ('useStaticWidth' in $$props) $$invalidate(3, useStaticWidth = $$new_props.useStaticWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, description, stickyHeader, useStaticWidth, $$restProps, $$scope, slots];
    }

    class TableContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$y, create_fragment$y, safe_not_equal, {
    			title: 0,
    			description: 1,
    			stickyHeader: 2,
    			useStaticWidth: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableContainer",
    			options,
    			id: create_fragment$y.name
    		});
    	}

    	get title() {
    		throw new Error("<TableContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<TableContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<TableContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<TableContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stickyHeader() {
    		throw new Error("<TableContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stickyHeader(value) {
    		throw new Error("<TableContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get useStaticWidth() {
    		throw new Error("<TableContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set useStaticWidth(value) {
    		throw new Error("<TableContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var TableContainer$1 = TableContainer;

    /* node_modules/carbon-components-svelte/src/DataTable/TableHead.svelte generated by Svelte v3.55.1 */

    const file$t = "node_modules/carbon-components-svelte/src/DataTable/TableHead.svelte";

    function create_fragment$x(ctx) {
    	let thead;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	let thead_levels = [/*$$restProps*/ ctx[0]];
    	let thead_data = {};

    	for (let i = 0; i < thead_levels.length; i += 1) {
    		thead_data = assign(thead_data, thead_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			if (default_slot) default_slot.c();
    			set_attributes(thead, thead_data);
    			add_location(thead, file$t, 1, 0, 57);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);

    			if (default_slot) {
    				default_slot.m(thead, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(thead, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(thead, "mouseover", /*mouseover_handler*/ ctx[4], false, false, false),
    					listen_dev(thead, "mouseenter", /*mouseenter_handler*/ ctx[5], false, false, false),
    					listen_dev(thead, "mouseleave", /*mouseleave_handler*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(thead, thead_data = get_spread_update(thead_levels, [dirty & /*$$restProps*/ 1 && /*$$restProps*/ ctx[0]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableHead', slots, ['default']);

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(0, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('$$scope' in $$new_props) $$invalidate(1, $$scope = $$new_props.$$scope);
    	};

    	return [
    		$$restProps,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class TableHead extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableHead",
    			options,
    			id: create_fragment$x.name
    		});
    	}
    }

    var TableHead$1 = TableHead;

    /* node_modules/carbon-components-svelte/src/icons/ArrowUp.svelte generated by Svelte v3.55.1 */

    const file$s = "node_modules/carbon-components-svelte/src/icons/ArrowUp.svelte";

    // (24:2) {#if title}
    function create_if_block$m(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$s, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$m.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let svg;
    	let path;
    	let if_block = /*title*/ ctx[1] && create_if_block$m(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path = svg_element("path");
    			attr_dev(path, "d", "M16 4L6 14 7.41 15.41 15 7.83 15 28 17 28 17 7.83 24.59 15.41 26 14 16 4z");
    			add_location(path, file$s, 24, 2, 579);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$s, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$m(ctx);
    					if_block.c();
    					if_block.m(svg, path);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ArrowUp', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class ArrowUp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArrowUp",
    			options,
    			id: create_fragment$w.name
    		});
    	}

    	get size() {
    		throw new Error("<ArrowUp>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ArrowUp>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ArrowUp>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ArrowUp>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ArrowUp$1 = ArrowUp;

    /* node_modules/carbon-components-svelte/src/icons/ArrowsVertical.svelte generated by Svelte v3.55.1 */

    const file$r = "node_modules/carbon-components-svelte/src/icons/ArrowsVertical.svelte";

    // (24:2) {#if title}
    function create_if_block$l(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$r, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$l.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$v(ctx) {
    	let svg;
    	let path;
    	let if_block = /*title*/ ctx[1] && create_if_block$l(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path = svg_element("path");
    			attr_dev(path, "d", "M27.6 20.6L24 24.2 24 4 22 4 22 24.2 18.4 20.6 17 22 23 28 29 22zM9 4L3 10 4.4 11.4 8 7.8 8 28 10 28 10 7.8 13.6 11.4 15 10z");
    			add_location(path, file$r, 24, 2, 579);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$r, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$l(ctx);
    					if_block.c();
    					if_block.m(svg, path);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ArrowsVertical', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class ArrowsVertical extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArrowsVertical",
    			options,
    			id: create_fragment$v.name
    		});
    	}

    	get size() {
    		throw new Error("<ArrowsVertical>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ArrowsVertical>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ArrowsVertical>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ArrowsVertical>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ArrowsVertical$1 = ArrowsVertical;

    /* node_modules/carbon-components-svelte/src/DataTable/TableHeader.svelte generated by Svelte v3.55.1 */
    const file$q = "node_modules/carbon-components-svelte/src/DataTable/TableHeader.svelte";

    // (67:0) {:else}
    function create_else_block$6(ctx) {
    	let th;
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let th_levels = [
    		{ scope: /*scope*/ ctx[3] },
    		{ "data-header": /*id*/ ctx[4] },
    		/*$$restProps*/ ctx[6]
    	];

    	let th_data = {};

    	for (let i = 0; i < th_levels.length; i += 1) {
    		th_data = assign(th_data, th_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			th = element("th");
    			div = element("div");
    			if (default_slot) default_slot.c();
    			toggle_class(div, "bx--table-header-label", true);
    			add_location(div, file$q, 76, 4, 1748);
    			set_attributes(th, th_data);
    			add_location(th, file$q, 67, 2, 1606);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, div);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(th, "click", /*click_handler_1*/ ctx[14], false, false, false),
    					listen_dev(th, "mouseover", /*mouseover_handler_1*/ ctx[15], false, false, false),
    					listen_dev(th, "mouseenter", /*mouseenter_handler_1*/ ctx[16], false, false, false),
    					listen_dev(th, "mouseleave", /*mouseleave_handler_1*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(th, th_data = get_spread_update(th_levels, [
    				(!current || dirty & /*scope*/ 8) && { scope: /*scope*/ ctx[3] },
    				(!current || dirty & /*id*/ 16) && { "data-header": /*id*/ ctx[4] },
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(67:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (34:0) {#if sortable}
    function create_if_block$k(ctx) {
    	let th;
    	let button;
    	let div;
    	let t0;
    	let arrowup;
    	let t1;
    	let arrowsvertical;
    	let th_aria_sort_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	arrowup = new ArrowUp$1({
    			props: {
    				size: 20,
    				"aria-label": /*ariaLabel*/ ctx[5],
    				class: "bx--table-sort__icon"
    			},
    			$$inline: true
    		});

    	arrowsvertical = new ArrowsVertical$1({
    			props: {
    				size: 20,
    				"aria-label": /*ariaLabel*/ ctx[5],
    				class: "bx--table-sort__icon-unsorted"
    			},
    			$$inline: true
    		});

    	let th_levels = [
    		{
    			"aria-sort": th_aria_sort_value = /*active*/ ctx[2] ? /*sortDirection*/ ctx[1] : 'none'
    		},
    		{ scope: /*scope*/ ctx[3] },
    		{ "data-header": /*id*/ ctx[4] },
    		/*$$restProps*/ ctx[6]
    	];

    	let th_data = {};

    	for (let i = 0; i < th_levels.length; i += 1) {
    		th_data = assign(th_data, th_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			th = element("th");
    			button = element("button");
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			create_component(arrowup.$$.fragment);
    			t1 = space();
    			create_component(arrowsvertical.$$.fragment);
    			toggle_class(div, "bx--table-header-label", true);
    			add_location(div, file$q, 51, 6, 1256);
    			attr_dev(button, "type", "button");
    			toggle_class(button, "bx--table-sort", true);
    			toggle_class(button, "bx--table-sort--active", /*active*/ ctx[2]);
    			toggle_class(button, "bx--table-sort--ascending", /*active*/ ctx[2] && /*sortDirection*/ ctx[1] === 'descending');
    			add_location(button, file$q, 43, 4, 1028);
    			set_attributes(th, th_data);
    			add_location(th, file$q, 34, 2, 849);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, button);
    			append_dev(button, div);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(button, t0);
    			mount_component(arrowup, button, null);
    			append_dev(button, t1);
    			mount_component(arrowsvertical, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[13], false, false, false),
    					listen_dev(th, "mouseover", /*mouseover_handler*/ ctx[10], false, false, false),
    					listen_dev(th, "mouseenter", /*mouseenter_handler*/ ctx[11], false, false, false),
    					listen_dev(th, "mouseleave", /*mouseleave_handler*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			const arrowup_changes = {};
    			if (dirty & /*ariaLabel*/ 32) arrowup_changes["aria-label"] = /*ariaLabel*/ ctx[5];
    			arrowup.$set(arrowup_changes);
    			const arrowsvertical_changes = {};
    			if (dirty & /*ariaLabel*/ 32) arrowsvertical_changes["aria-label"] = /*ariaLabel*/ ctx[5];
    			arrowsvertical.$set(arrowsvertical_changes);

    			if (!current || dirty & /*active*/ 4) {
    				toggle_class(button, "bx--table-sort--active", /*active*/ ctx[2]);
    			}

    			if (!current || dirty & /*active, sortDirection*/ 6) {
    				toggle_class(button, "bx--table-sort--ascending", /*active*/ ctx[2] && /*sortDirection*/ ctx[1] === 'descending');
    			}

    			set_attributes(th, th_data = get_spread_update(th_levels, [
    				(!current || dirty & /*active, sortDirection*/ 6 && th_aria_sort_value !== (th_aria_sort_value = /*active*/ ctx[2] ? /*sortDirection*/ ctx[1] : 'none')) && { "aria-sort": th_aria_sort_value },
    				(!current || dirty & /*scope*/ 8) && { scope: /*scope*/ ctx[3] },
    				(!current || dirty & /*id*/ 16) && { "data-header": /*id*/ ctx[4] },
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(arrowup.$$.fragment, local);
    			transition_in(arrowsvertical.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(arrowup.$$.fragment, local);
    			transition_out(arrowsvertical.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			if (default_slot) default_slot.d(detaching);
    			destroy_component(arrowup);
    			destroy_component(arrowsvertical);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$k.name,
    		type: "if",
    		source: "(34:0) {#if sortable}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$k, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*sortable*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	const omit_props_names = ["sortable","sortDirection","active","scope","translateWithId","id"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableHeader', slots, ['default']);
    	let { sortable = false } = $$props;
    	let { sortDirection = "none" } = $$props;
    	let { active = false } = $$props;
    	let { scope = "col" } = $$props;
    	let { translateWithId = () => "" } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('sortable' in $$new_props) $$invalidate(0, sortable = $$new_props.sortable);
    		if ('sortDirection' in $$new_props) $$invalidate(1, sortDirection = $$new_props.sortDirection);
    		if ('active' in $$new_props) $$invalidate(2, active = $$new_props.active);
    		if ('scope' in $$new_props) $$invalidate(3, scope = $$new_props.scope);
    		if ('translateWithId' in $$new_props) $$invalidate(7, translateWithId = $$new_props.translateWithId);
    		if ('id' in $$new_props) $$invalidate(4, id = $$new_props.id);
    		if ('$$scope' in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		sortable,
    		sortDirection,
    		active,
    		scope,
    		translateWithId,
    		id,
    		ArrowUp: ArrowUp$1,
    		ArrowsVertical: ArrowsVertical$1,
    		ariaLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('sortable' in $$props) $$invalidate(0, sortable = $$new_props.sortable);
    		if ('sortDirection' in $$props) $$invalidate(1, sortDirection = $$new_props.sortDirection);
    		if ('active' in $$props) $$invalidate(2, active = $$new_props.active);
    		if ('scope' in $$props) $$invalidate(3, scope = $$new_props.scope);
    		if ('translateWithId' in $$props) $$invalidate(7, translateWithId = $$new_props.translateWithId);
    		if ('id' in $$props) $$invalidate(4, id = $$new_props.id);
    		if ('ariaLabel' in $$props) $$invalidate(5, ariaLabel = $$new_props.ariaLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*translateWithId*/ 128) {
    			// TODO: translate with id
    			$$invalidate(5, ariaLabel = translateWithId());
    		}
    	};

    	return [
    		sortable,
    		sortDirection,
    		active,
    		scope,
    		id,
    		ariaLabel,
    		$$restProps,
    		translateWithId,
    		$$scope,
    		slots,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		click_handler,
    		click_handler_1,
    		mouseover_handler_1,
    		mouseenter_handler_1,
    		mouseleave_handler_1
    	];
    }

    class TableHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {
    			sortable: 0,
    			sortDirection: 1,
    			active: 2,
    			scope: 3,
    			translateWithId: 7,
    			id: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableHeader",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get sortable() {
    		throw new Error("<TableHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortable(value) {
    		throw new Error("<TableHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sortDirection() {
    		throw new Error("<TableHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortDirection(value) {
    		throw new Error("<TableHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<TableHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<TableHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scope() {
    		throw new Error("<TableHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scope(value) {
    		throw new Error("<TableHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translateWithId() {
    		throw new Error("<TableHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set translateWithId(value) {
    		throw new Error("<TableHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<TableHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<TableHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var TableHeader$1 = TableHeader;

    /* node_modules/carbon-components-svelte/src/DataTable/TableRow.svelte generated by Svelte v3.55.1 */

    const file$p = "node_modules/carbon-components-svelte/src/DataTable/TableRow.svelte";

    function create_fragment$t(ctx) {
    	let tr;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	let tr_levels = [/*$$restProps*/ ctx[0]];
    	let tr_data = {};

    	for (let i = 0; i < tr_levels.length; i += 1) {
    		tr_data = assign(tr_data, tr_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			if (default_slot) default_slot.c();
    			set_attributes(tr, tr_data);
    			add_location(tr, file$p, 1, 0, 57);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			if (default_slot) {
    				default_slot.m(tr, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(tr, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(tr, "mouseover", /*mouseover_handler*/ ctx[4], false, false, false),
    					listen_dev(tr, "mouseenter", /*mouseenter_handler*/ ctx[5], false, false, false),
    					listen_dev(tr, "mouseleave", /*mouseleave_handler*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(tr, tr_data = get_spread_update(tr_levels, [dirty & /*$$restProps*/ 1 && /*$$restProps*/ ctx[0]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableRow', slots, ['default']);

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(0, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('$$scope' in $$new_props) $$invalidate(1, $$scope = $$new_props.$$scope);
    	};

    	return [
    		$$restProps,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class TableRow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableRow",
    			options,
    			id: create_fragment$t.name
    		});
    	}
    }

    var TableRow$1 = TableRow;

    /* node_modules/carbon-components-svelte/src/DataTable/DataTable.svelte generated by Svelte v3.55.1 */
    const file$o = "node_modules/carbon-components-svelte/src/DataTable/DataTable.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[66] = list[i];
    	child_ctx[68] = i;
    	return child_ctx;
    }

    const get_expanded_row_slot_changes = dirty => ({
    	row: dirty[0] & /*sorting, displayedSortedRows, displayedRows*/ 201850880
    });

    const get_expanded_row_slot_context = ctx => ({ row: /*row*/ ctx[66] });

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[69] = list[i];
    	child_ctx[71] = i;
    	return child_ctx;
    }

    const get_cell_slot_changes_1 = dirty => ({
    	row: dirty[0] & /*sorting, displayedSortedRows, displayedRows*/ 201850880,
    	cell: dirty[0] & /*tableCellsByRowId, sorting, displayedSortedRows, displayedRows*/ 470286336,
    	rowIndex: dirty[0] & /*sorting, displayedSortedRows, displayedRows*/ 201850880,
    	cellIndex: dirty[0] & /*tableCellsByRowId, sorting, displayedSortedRows, displayedRows*/ 470286336
    });

    const get_cell_slot_context_1 = ctx => ({
    	row: /*row*/ ctx[66],
    	cell: /*cell*/ ctx[69],
    	rowIndex: /*i*/ ctx[68],
    	cellIndex: /*j*/ ctx[71]
    });

    const get_cell_slot_changes = dirty => ({
    	row: dirty[0] & /*sorting, displayedSortedRows, displayedRows*/ 201850880,
    	cell: dirty[0] & /*tableCellsByRowId, sorting, displayedSortedRows, displayedRows*/ 470286336,
    	rowIndex: dirty[0] & /*sorting, displayedSortedRows, displayedRows*/ 201850880,
    	cellIndex: dirty[0] & /*tableCellsByRowId, sorting, displayedSortedRows, displayedRows*/ 470286336
    });

    const get_cell_slot_context = ctx => ({
    	row: /*row*/ ctx[66],
    	cell: /*cell*/ ctx[69],
    	rowIndex: /*i*/ ctx[68],
    	cellIndex: /*j*/ ctx[71]
    });

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[72] = list[i];
    	return child_ctx;
    }

    const get_cell_header_slot_changes = dirty => ({ header: dirty[0] & /*headers*/ 64 });
    const get_cell_header_slot_context = ctx => ({ header: /*header*/ ctx[72] });
    const get_description_slot_changes = dirty => ({});
    const get_description_slot_context = ctx => ({});
    const get_title_slot_changes$1 = dirty => ({});
    const get_title_slot_context$1 = ctx => ({});

    // (262:2) {#if title || $$slots.title || description || $$slots.description}
    function create_if_block_13(ctx) {
    	let div;
    	let t;
    	let current;
    	let if_block0 = (/*title*/ ctx[8] || /*$$slots*/ ctx[38].title) && create_if_block_15(ctx);
    	let if_block1 = (/*description*/ ctx[9] || /*$$slots*/ ctx[38].description) && create_if_block_14(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			toggle_class(div, "bx--data-table-header", true);
    			add_location(div, file$o, 262, 4, 8703);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[8] || /*$$slots*/ ctx[38].title) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*title*/ 256 | dirty[1] & /*$$slots*/ 128) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_15(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*description*/ ctx[9] || /*$$slots*/ ctx[38].description) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*description*/ 512 | dirty[1] & /*$$slots*/ 128) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_14(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(262:2) {#if title || $$slots.title || description || $$slots.description}",
    		ctx
    	});

    	return block;
    }

    // (264:6) {#if title || $$slots.title}
    function create_if_block_15(ctx) {
    	let h4;
    	let current;
    	const title_slot_template = /*#slots*/ ctx[48].title;
    	const title_slot = create_slot(title_slot_template, ctx, /*$$scope*/ ctx[62], get_title_slot_context$1);
    	const title_slot_or_fallback = title_slot || fallback_block_4(ctx);

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			if (title_slot_or_fallback) title_slot_or_fallback.c();
    			toggle_class(h4, "bx--data-table-header__title", true);
    			add_location(h4, file$o, 264, 8, 8789);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);

    			if (title_slot_or_fallback) {
    				title_slot_or_fallback.m(h4, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (title_slot) {
    				if (title_slot.p && (!current || dirty[2] & /*$$scope*/ 1)) {
    					update_slot_base(
    						title_slot,
    						title_slot_template,
    						ctx,
    						/*$$scope*/ ctx[62],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[62])
    						: get_slot_changes(title_slot_template, /*$$scope*/ ctx[62], dirty, get_title_slot_changes$1),
    						get_title_slot_context$1
    					);
    				}
    			} else {
    				if (title_slot_or_fallback && title_slot_or_fallback.p && (!current || dirty[0] & /*title*/ 256)) {
    					title_slot_or_fallback.p(ctx, !current ? [-1, -1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (title_slot_or_fallback) title_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(264:6) {#if title || $$slots.title}",
    		ctx
    	});

    	return block;
    }

    // (266:29) {title}
    function fallback_block_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*title*/ ctx[8]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*title*/ 256) set_data_dev(t, /*title*/ ctx[8]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_4.name,
    		type: "fallback",
    		source: "(266:29) {title}",
    		ctx
    	});

    	return block;
    }

    // (269:6) {#if description || $$slots.description}
    function create_if_block_14(ctx) {
    	let p;
    	let current;
    	const description_slot_template = /*#slots*/ ctx[48].description;
    	const description_slot = create_slot(description_slot_template, ctx, /*$$scope*/ ctx[62], get_description_slot_context);
    	const description_slot_or_fallback = description_slot || fallback_block_3(ctx);

    	const block = {
    		c: function create() {
    			p = element("p");
    			if (description_slot_or_fallback) description_slot_or_fallback.c();
    			toggle_class(p, "bx--data-table-header__description", true);
    			add_location(p, file$o, 269, 8, 8963);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);

    			if (description_slot_or_fallback) {
    				description_slot_or_fallback.m(p, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (description_slot) {
    				if (description_slot.p && (!current || dirty[2] & /*$$scope*/ 1)) {
    					update_slot_base(
    						description_slot,
    						description_slot_template,
    						ctx,
    						/*$$scope*/ ctx[62],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[62])
    						: get_slot_changes(description_slot_template, /*$$scope*/ ctx[62], dirty, get_description_slot_changes),
    						get_description_slot_context
    					);
    				}
    			} else {
    				if (description_slot_or_fallback && description_slot_or_fallback.p && (!current || dirty[0] & /*description*/ 512)) {
    					description_slot_or_fallback.p(ctx, !current ? [-1, -1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(description_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(description_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (description_slot_or_fallback) description_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(269:6) {#if description || $$slots.description}",
    		ctx
    	});

    	return block;
    }

    // (271:35) {description}
    function fallback_block_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*description*/ ctx[9]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*description*/ 512) set_data_dev(t, /*description*/ ctx[9]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_3.name,
    		type: "fallback",
    		source: "(271:35) {description}",
    		ctx
    	});

    	return block;
    }

    // (287:8) {#if expandable}
    function create_if_block_11$1(ctx) {
    	let th;
    	let th_data_previous_value_value;
    	let current;
    	let if_block = /*batchExpansion*/ ctx[12] && create_if_block_12$1(ctx);

    	const block = {
    		c: function create() {
    			th = element("th");
    			if (if_block) if_block.c();
    			attr_dev(th, "scope", "col");
    			attr_dev(th, "data-previous-value", th_data_previous_value_value = /*expanded*/ ctx[22] ? 'collapsed' : undefined);
    			toggle_class(th, "bx--table-expand", true);
    			add_location(th, file$o, 287, 10, 9410);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			if (if_block) if_block.m(th, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*batchExpansion*/ ctx[12]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*batchExpansion*/ 4096) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_12$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(th, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*expanded*/ 4194304 && th_data_previous_value_value !== (th_data_previous_value_value = /*expanded*/ ctx[22] ? 'collapsed' : undefined)) {
    				attr_dev(th, "data-previous-value", th_data_previous_value_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11$1.name,
    		type: "if",
    		source: "(287:8) {#if expandable}",
    		ctx
    	});

    	return block;
    }

    // (293:12) {#if batchExpansion}
    function create_if_block_12$1(ctx) {
    	let button;
    	let chevronright;
    	let current;
    	let mounted;
    	let dispose;

    	chevronright = new ChevronRight$1({
    			props: { class: "bx--table-expand__svg" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(chevronright.$$.fragment);
    			attr_dev(button, "type", "button");
    			toggle_class(button, "bx--table-expand__button", true);
    			add_location(button, file$o, 293, 14, 9612);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(chevronright, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[49], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chevronright.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chevronright.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(chevronright);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12$1.name,
    		type: "if",
    		source: "(293:12) {#if batchExpansion}",
    		ctx
    	});

    	return block;
    }

    // (309:8) {#if selectable && !batchSelection}
    function create_if_block_10$1(ctx) {
    	let th;

    	const block = {
    		c: function create() {
    			th = element("th");
    			attr_dev(th, "scope", "col");
    			add_location(th, file$o, 309, 10, 10142);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10$1.name,
    		type: "if",
    		source: "(309:8) {#if selectable && !batchSelection}",
    		ctx
    	});

    	return block;
    }

    // (312:8) {#if batchSelection && !radio}
    function create_if_block_9$1(ctx) {
    	let th;
    	let inlinecheckbox;
    	let updating_ref;
    	let current;

    	function inlinecheckbox_ref_binding(value) {
    		/*inlinecheckbox_ref_binding*/ ctx[50](value);
    	}

    	let inlinecheckbox_props = {
    		"aria-label": "Select all rows",
    		checked: /*selectAll*/ ctx[30],
    		indeterminate: /*indeterminate*/ ctx[29]
    	};

    	if (/*refSelectAll*/ ctx[24] !== void 0) {
    		inlinecheckbox_props.ref = /*refSelectAll*/ ctx[24];
    	}

    	inlinecheckbox = new InlineCheckbox$1({
    			props: inlinecheckbox_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(inlinecheckbox, 'ref', inlinecheckbox_ref_binding));
    	inlinecheckbox.$on("change", /*change_handler*/ ctx[51]);

    	const block = {
    		c: function create() {
    			th = element("th");
    			create_component(inlinecheckbox.$$.fragment);
    			attr_dev(th, "scope", "col");
    			toggle_class(th, "bx--table-column-checkbox", true);
    			add_location(th, file$o, 312, 10, 10227);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			mount_component(inlinecheckbox, th, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inlinecheckbox_changes = {};
    			if (dirty[0] & /*selectAll*/ 1073741824) inlinecheckbox_changes.checked = /*selectAll*/ ctx[30];
    			if (dirty[0] & /*indeterminate*/ 536870912) inlinecheckbox_changes.indeterminate = /*indeterminate*/ ctx[29];

    			if (!updating_ref && dirty[0] & /*refSelectAll*/ 16777216) {
    				updating_ref = true;
    				inlinecheckbox_changes.ref = /*refSelectAll*/ ctx[24];
    				add_flush_callback(() => updating_ref = false);
    			}

    			inlinecheckbox.$set(inlinecheckbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inlinecheckbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inlinecheckbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			destroy_component(inlinecheckbox);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$1.name,
    		type: "if",
    		source: "(312:8) {#if batchSelection && !radio}",
    		ctx
    	});

    	return block;
    }

    // (344:10) {:else}
    function create_else_block_2(ctx) {
    	let tableheader;
    	let current;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[52](/*header*/ ctx[72]);
    	}

    	tableheader = new TableHeader$1({
    			props: {
    				id: /*header*/ ctx[72].key,
    				style: /*formatHeaderWidth*/ ctx[36](/*header*/ ctx[72]),
    				sortable: /*sortable*/ ctx[11] && /*header*/ ctx[72].sort !== false,
    				sortDirection: /*sortKey*/ ctx[0] === /*header*/ ctx[72].key
    				? /*sortDirection*/ ctx[1]
    				: 'none',
    				active: /*sortKey*/ ctx[0] === /*header*/ ctx[72].key,
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tableheader.$on("click", click_handler_1);

    	const block = {
    		c: function create() {
    			create_component(tableheader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tableheader, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const tableheader_changes = {};
    			if (dirty[0] & /*headers*/ 64) tableheader_changes.id = /*header*/ ctx[72].key;
    			if (dirty[0] & /*headers*/ 64) tableheader_changes.style = /*formatHeaderWidth*/ ctx[36](/*header*/ ctx[72]);
    			if (dirty[0] & /*sortable, headers*/ 2112) tableheader_changes.sortable = /*sortable*/ ctx[11] && /*header*/ ctx[72].sort !== false;

    			if (dirty[0] & /*sortKey, headers, sortDirection*/ 67) tableheader_changes.sortDirection = /*sortKey*/ ctx[0] === /*header*/ ctx[72].key
    			? /*sortDirection*/ ctx[1]
    			: 'none';

    			if (dirty[0] & /*sortKey, headers*/ 65) tableheader_changes.active = /*sortKey*/ ctx[0] === /*header*/ ctx[72].key;

    			if (dirty[0] & /*headers*/ 64 | dirty[2] & /*$$scope*/ 1) {
    				tableheader_changes.$$scope = { dirty, ctx };
    			}

    			tableheader.$set(tableheader_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tableheader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tableheader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tableheader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(344:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (342:10) {#if header.empty}
    function create_if_block_8$1(ctx) {
    	let th;
    	let th_style_value;

    	const block = {
    		c: function create() {
    			th = element("th");
    			attr_dev(th, "scope", "col");
    			attr_dev(th, "style", th_style_value = /*formatHeaderWidth*/ ctx[36](/*header*/ ctx[72]));
    			add_location(th, file$o, 342, 12, 11210);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*headers*/ 64 && th_style_value !== (th_style_value = /*formatHeaderWidth*/ ctx[36](/*header*/ ctx[72]))) {
    				attr_dev(th, "style", th_style_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$1.name,
    		type: "if",
    		source: "(342:10) {#if header.empty}",
    		ctx
    	});

    	return block;
    }

    // (366:57) {header.value}
    function fallback_block_2(ctx) {
    	let t_value = /*header*/ ctx[72].value + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*headers*/ 64 && t_value !== (t_value = /*header*/ ctx[72].value + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_2.name,
    		type: "fallback",
    		source: "(366:57) {header.value}",
    		ctx
    	});

    	return block;
    }

    // (345:12) <TableHeader               id="{header.key}"               style="{formatHeaderWidth(header)}"               sortable="{sortable && header.sort !== false}"               sortDirection="{sortKey === header.key ? sortDirection : 'none'}"               active="{sortKey === header.key}"               on:click="{() => {                 dispatch('click', { header });                  if (header.sort === false) {                   dispatch('click:header', { header });                 } else {                   let currentSortDirection =                     sortKey === header.key ? sortDirection : 'none';                   sortDirection = sortDirectionMap[currentSortDirection];                   sortKey =                     sortDirection === 'none' ? null : thKeys[header.key];                   dispatch('click:header', { header, sortDirection });                 }               }}"             >
    function create_default_slot_9(ctx) {
    	let t;
    	let current;
    	const cell_header_slot_template = /*#slots*/ ctx[48]["cell-header"];
    	const cell_header_slot = create_slot(cell_header_slot_template, ctx, /*$$scope*/ ctx[62], get_cell_header_slot_context);
    	const cell_header_slot_or_fallback = cell_header_slot || fallback_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (cell_header_slot_or_fallback) cell_header_slot_or_fallback.c();
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			if (cell_header_slot_or_fallback) {
    				cell_header_slot_or_fallback.m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (cell_header_slot) {
    				if (cell_header_slot.p && (!current || dirty[0] & /*headers*/ 64 | dirty[2] & /*$$scope*/ 1)) {
    					update_slot_base(
    						cell_header_slot,
    						cell_header_slot_template,
    						ctx,
    						/*$$scope*/ ctx[62],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[62])
    						: get_slot_changes(cell_header_slot_template, /*$$scope*/ ctx[62], dirty, get_cell_header_slot_changes),
    						get_cell_header_slot_context
    					);
    				}
    			} else {
    				if (cell_header_slot_or_fallback && cell_header_slot_or_fallback.p && (!current || dirty[0] & /*headers*/ 64)) {
    					cell_header_slot_or_fallback.p(ctx, !current ? [-1, -1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cell_header_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cell_header_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (cell_header_slot_or_fallback) cell_header_slot_or_fallback.d(detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(345:12) <TableHeader               id=\\\"{header.key}\\\"               style=\\\"{formatHeaderWidth(header)}\\\"               sortable=\\\"{sortable && header.sort !== false}\\\"               sortDirection=\\\"{sortKey === header.key ? sortDirection : 'none'}\\\"               active=\\\"{sortKey === header.key}\\\"               on:click=\\\"{() => {                 dispatch('click', { header });                  if (header.sort === false) {                   dispatch('click:header', { header });                 } else {                   let currentSortDirection =                     sortKey === header.key ? sortDirection : 'none';                   sortDirection = sortDirectionMap[currentSortDirection];                   sortKey =                     sortDirection === 'none' ? null : thKeys[header.key];                   dispatch('click:header', { header, sortDirection });                 }               }}\\\"             >",
    		ctx
    	});

    	return block;
    }

    // (341:8) {#each headers as header (header.key)}
    function create_each_block_2(key_1, ctx) {
    	let first;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_8$1, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*header*/ ctx[72].empty) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(341:8) {#each headers as header (header.key)}",
    		ctx
    	});

    	return block;
    }

    // (286:6) <TableRow>
    function create_default_slot_8(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let if_block0 = /*expandable*/ ctx[4] && create_if_block_11$1(ctx);
    	let if_block1 = /*selectable*/ ctx[5] && !/*batchSelection*/ ctx[15] && create_if_block_10$1(ctx);
    	let if_block2 = /*batchSelection*/ ctx[15] && !/*radio*/ ctx[14] && create_if_block_9$1(ctx);
    	let each_value_2 = /*headers*/ ctx[6];
    	validate_each_argument(each_value_2);
    	const get_key = ctx => /*header*/ ctx[72].key;
    	validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		let child_ctx = get_each_context_2(ctx, each_value_2, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t2, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*expandable*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*expandable*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_11$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*selectable*/ ctx[5] && !/*batchSelection*/ ctx[15]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_10$1(ctx);
    					if_block1.c();
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*batchSelection*/ ctx[15] && !/*radio*/ ctx[14]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*batchSelection, radio*/ 49152) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_9$1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(t2.parentNode, t2);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*headers, sortable, sortKey, sortDirection*/ 2115 | dirty[1] & /*formatHeaderWidth, dispatch, sortDirectionMap, thKeys*/ 46 | dirty[2] & /*$$scope*/ 1) {
    				each_value_2 = /*headers*/ ctx[6];
    				validate_each_argument(each_value_2);
    				group_outros();
    				validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block_2, each_1_anchor, get_each_context_2);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block2);

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(286:6) <TableRow>",
    		ctx
    	});

    	return block;
    }

    // (285:4) <TableHead>
    function create_default_slot_7(ctx) {
    	let tablerow;
    	let current;

    	tablerow = new TableRow$1({
    			props: {
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tablerow.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tablerow, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tablerow_changes = {};

    			if (dirty[0] & /*headers, sortable, sortKey, sortDirection, selectAll, indeterminate, refSelectAll, selectedRowIds, selectableRowIds, batchSelection, radio, selectable, expanded, expandedRowIds, expandableRowIds, batchExpansion, expandable*/ 1634785407 | dirty[1] & /*thKeys*/ 2 | dirty[2] & /*$$scope*/ 1) {
    				tablerow_changes.$$scope = { dirty, ctx };
    			}

    			tablerow.$set(tablerow_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablerow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablerow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tablerow, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(285:4) <TableHead>",
    		ctx
    	});

    	return block;
    }

    // (404:10) {#if expandable}
    function create_if_block_6$3(ctx) {
    	let tablecell;
    	let current;

    	tablecell = new TableCell$1({
    			props: {
    				class: "bx--table-expand",
    				headers: "expand",
    				"data-previous-value": !/*nonExpandableRowIds*/ ctx[13].includes(/*row*/ ctx[66].id) && /*expandedRows*/ ctx[31][/*row*/ ctx[66].id]
    				? 'collapsed'
    				: undefined,
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tablecell.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tablecell, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tablecell_changes = {};

    			if (dirty[0] & /*nonExpandableRowIds, sorting, displayedSortedRows, displayedRows*/ 201859072 | dirty[1] & /*expandedRows*/ 1) tablecell_changes["data-previous-value"] = !/*nonExpandableRowIds*/ ctx[13].includes(/*row*/ ctx[66].id) && /*expandedRows*/ ctx[31][/*row*/ ctx[66].id]
    			? 'collapsed'
    			: undefined;

    			if (dirty[0] & /*sorting, displayedSortedRows, displayedRows, expandedRowIds, nonExpandableRowIds*/ 201859076 | dirty[1] & /*expandedRows*/ 1 | dirty[2] & /*$$scope*/ 1) {
    				tablecell_changes.$$scope = { dirty, ctx };
    			}

    			tablecell.$set(tablecell_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablecell.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablecell.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tablecell, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$3.name,
    		type: "if",
    		source: "(404:10) {#if expandable}",
    		ctx
    	});

    	return block;
    }

    // (413:14) {#if !nonExpandableRowIds.includes(row.id)}
    function create_if_block_7$1(ctx) {
    	let button;
    	let chevronright;
    	let button_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;

    	chevronright = new ChevronRight$1({
    			props: { class: "bx--table-expand__svg" },
    			$$inline: true
    		});

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[53](/*row*/ ctx[66]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(chevronright.$$.fragment);
    			attr_dev(button, "type", "button");

    			attr_dev(button, "aria-label", button_aria_label_value = /*expandedRows*/ ctx[31][/*row*/ ctx[66].id]
    			? 'Collapse current row'
    			: 'Expand current row');

    			toggle_class(button, "bx--table-expand__button", true);
    			add_location(button, file$o, 413, 16, 13943);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(chevronright, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", stop_propagation(click_handler_2), false, false, true);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty[0] & /*sorting, displayedSortedRows, displayedRows*/ 201850880 | dirty[1] & /*expandedRows*/ 1 && button_aria_label_value !== (button_aria_label_value = /*expandedRows*/ ctx[31][/*row*/ ctx[66].id]
    			? 'Collapse current row'
    			: 'Expand current row')) {
    				attr_dev(button, "aria-label", button_aria_label_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chevronright.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chevronright.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(chevronright);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(413:14) {#if !nonExpandableRowIds.includes(row.id)}",
    		ctx
    	});

    	return block;
    }

    // (405:12) <TableCell               class="bx--table-expand"               headers="expand"               data-previous-value="{!nonExpandableRowIds.includes(row.id) &&               expandedRows[row.id]                 ? 'collapsed'                 : undefined}"             >
    function create_default_slot_6$1(ctx) {
    	let show_if = !/*nonExpandableRowIds*/ ctx[13].includes(/*row*/ ctx[66].id);
    	let if_block_anchor;
    	let current;
    	let if_block = show_if && create_if_block_7$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*nonExpandableRowIds, sorting, displayedSortedRows, displayedRows*/ 201859072) show_if = !/*nonExpandableRowIds*/ ctx[13].includes(/*row*/ ctx[66].id);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*nonExpandableRowIds, sorting, displayedSortedRows, displayedRows*/ 201859072) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_7$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(405:12) <TableCell               class=\\\"bx--table-expand\\\"               headers=\\\"expand\\\"               data-previous-value=\\\"{!nonExpandableRowIds.includes(row.id) &&               expandedRows[row.id]                 ? 'collapsed'                 : undefined}\\\"             >",
    		ctx
    	});

    	return block;
    }

    // (438:10) {#if selectable}
    function create_if_block_3$4(ctx) {
    	let td;
    	let show_if = !/*nonSelectableRowIds*/ ctx[16].includes(/*row*/ ctx[66].id);
    	let current;
    	let if_block = show_if && create_if_block_4$4(ctx);

    	const block = {
    		c: function create() {
    			td = element("td");
    			if (if_block) if_block.c();
    			toggle_class(td, "bx--table-column-checkbox", true);
    			toggle_class(td, "bx--table-column-radio", /*radio*/ ctx[14]);
    			add_location(td, file$o, 438, 12, 14853);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			if (if_block) if_block.m(td, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*nonSelectableRowIds, sorting, displayedSortedRows, displayedRows*/ 201916416) show_if = !/*nonSelectableRowIds*/ ctx[16].includes(/*row*/ ctx[66].id);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*nonSelectableRowIds, sorting, displayedSortedRows, displayedRows*/ 201916416) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_4$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(td, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*radio*/ 16384) {
    				toggle_class(td, "bx--table-column-radio", /*radio*/ ctx[14]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$4.name,
    		type: "if",
    		source: "(438:10) {#if selectable}",
    		ctx
    	});

    	return block;
    }

    // (443:14) {#if !nonSelectableRowIds.includes(row.id)}
    function create_if_block_4$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_5$4, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*radio*/ ctx[14]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$4.name,
    		type: "if",
    		source: "(443:14) {#if !nonSelectableRowIds.includes(row.id)}",
    		ctx
    	});

    	return block;
    }

    // (453:16) {:else}
    function create_else_block_1(ctx) {
    	let inlinecheckbox;
    	let current;

    	function change_handler_2() {
    		return /*change_handler_2*/ ctx[55](/*row*/ ctx[66]);
    	}

    	inlinecheckbox = new InlineCheckbox$1({
    			props: {
    				name: "select-row-" + /*row*/ ctx[66].id,
    				checked: /*selectedRowIds*/ ctx[3].includes(/*row*/ ctx[66].id)
    			},
    			$$inline: true
    		});

    	inlinecheckbox.$on("change", change_handler_2);

    	const block = {
    		c: function create() {
    			create_component(inlinecheckbox.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(inlinecheckbox, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const inlinecheckbox_changes = {};
    			if (dirty[0] & /*sorting, displayedSortedRows, displayedRows*/ 201850880) inlinecheckbox_changes.name = "select-row-" + /*row*/ ctx[66].id;
    			if (dirty[0] & /*selectedRowIds, sorting, displayedSortedRows, displayedRows*/ 201850888) inlinecheckbox_changes.checked = /*selectedRowIds*/ ctx[3].includes(/*row*/ ctx[66].id);
    			inlinecheckbox.$set(inlinecheckbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inlinecheckbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inlinecheckbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(inlinecheckbox, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(453:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (444:16) {#if radio}
    function create_if_block_5$4(ctx) {
    	let radiobutton;
    	let current;

    	function change_handler_1() {
    		return /*change_handler_1*/ ctx[54](/*row*/ ctx[66]);
    	}

    	radiobutton = new RadioButton$1({
    			props: {
    				name: "select-row-" + /*row*/ ctx[66].id,
    				checked: /*selectedRowIds*/ ctx[3].includes(/*row*/ ctx[66].id)
    			},
    			$$inline: true
    		});

    	radiobutton.$on("change", change_handler_1);

    	const block = {
    		c: function create() {
    			create_component(radiobutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(radiobutton, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const radiobutton_changes = {};
    			if (dirty[0] & /*sorting, displayedSortedRows, displayedRows*/ 201850880) radiobutton_changes.name = "select-row-" + /*row*/ ctx[66].id;
    			if (dirty[0] & /*selectedRowIds, sorting, displayedSortedRows, displayedRows*/ 201850888) radiobutton_changes.checked = /*selectedRowIds*/ ctx[3].includes(/*row*/ ctx[66].id);
    			radiobutton.$set(radiobutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(radiobutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(radiobutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(radiobutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$4.name,
    		type: "if",
    		source: "(444:16) {#if radio}",
    		ctx
    	});

    	return block;
    }

    // (486:12) {:else}
    function create_else_block$5(ctx) {
    	let tablecell;
    	let current;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[56](/*row*/ ctx[66], /*cell*/ ctx[69]);
    	}

    	tablecell = new TableCell$1({
    			props: {
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tablecell.$on("click", click_handler_3);

    	const block = {
    		c: function create() {
    			create_component(tablecell.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tablecell, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const tablecell_changes = {};

    			if (dirty[0] & /*tableCellsByRowId, sorting, displayedSortedRows, displayedRows*/ 470286336 | dirty[2] & /*$$scope*/ 1) {
    				tablecell_changes.$$scope = { dirty, ctx };
    			}

    			tablecell.$set(tablecell_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablecell.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablecell.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tablecell, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(486:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (474:12) {#if headers[j].empty}
    function create_if_block_2$5(ctx) {
    	let td;
    	let t;
    	let current;
    	const cell_slot_template = /*#slots*/ ctx[48].cell;
    	const cell_slot = create_slot(cell_slot_template, ctx, /*$$scope*/ ctx[62], get_cell_slot_context);
    	const cell_slot_or_fallback = cell_slot || fallback_block$8(ctx);

    	const block = {
    		c: function create() {
    			td = element("td");
    			if (cell_slot_or_fallback) cell_slot_or_fallback.c();
    			t = space();
    			toggle_class(td, "bx--table-column-menu", /*headers*/ ctx[6][/*j*/ ctx[71]].columnMenu);
    			add_location(td, file$o, 474, 14, 16350);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);

    			if (cell_slot_or_fallback) {
    				cell_slot_or_fallback.m(td, null);
    			}

    			append_dev(td, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (cell_slot) {
    				if (cell_slot.p && (!current || dirty[0] & /*sorting, displayedSortedRows, displayedRows, tableCellsByRowId*/ 470286336 | dirty[2] & /*$$scope*/ 1)) {
    					update_slot_base(
    						cell_slot,
    						cell_slot_template,
    						ctx,
    						/*$$scope*/ ctx[62],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[62])
    						: get_slot_changes(cell_slot_template, /*$$scope*/ ctx[62], dirty, get_cell_slot_changes),
    						get_cell_slot_context
    					);
    				}
    			} else {
    				if (cell_slot_or_fallback && cell_slot_or_fallback.p && (!current || dirty[0] & /*tableCellsByRowId, sorting, displayedSortedRows, displayedRows*/ 470286336)) {
    					cell_slot_or_fallback.p(ctx, !current ? [-1, -1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*headers, tableCellsByRowId, sorting, displayedSortedRows, displayedRows*/ 470286400) {
    				toggle_class(td, "bx--table-column-menu", /*headers*/ ctx[6][/*j*/ ctx[71]].columnMenu);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cell_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cell_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			if (cell_slot_or_fallback) cell_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(474:12) {#if headers[j].empty}",
    		ctx
    	});

    	return block;
    }

    // (499:17)
    function fallback_block_1$4(ctx) {
    	let t_value = (/*cell*/ ctx[69].display
    	? /*cell*/ ctx[69].display(/*cell*/ ctx[69].value)
    	: /*cell*/ ctx[69].value) + "";

    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*tableCellsByRowId, sorting, displayedSortedRows, displayedRows*/ 470286336 && t_value !== (t_value = (/*cell*/ ctx[69].display
    			? /*cell*/ ctx[69].display(/*cell*/ ctx[69].value)
    			: /*cell*/ ctx[69].value) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1$4.name,
    		type: "fallback",
    		source: "(499:17)                    ",
    		ctx
    	});

    	return block;
    }

    // (487:14) <TableCell                 on:click="{() => {                   dispatch('click', { row, cell });                   dispatch('click:cell', cell);                 }}"               >
    function create_default_slot_5$1(ctx) {
    	let t;
    	let current;
    	const cell_slot_template = /*#slots*/ ctx[48].cell;
    	const cell_slot = create_slot(cell_slot_template, ctx, /*$$scope*/ ctx[62], get_cell_slot_context_1);
    	const cell_slot_or_fallback = cell_slot || fallback_block_1$4(ctx);

    	const block = {
    		c: function create() {
    			if (cell_slot_or_fallback) cell_slot_or_fallback.c();
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			if (cell_slot_or_fallback) {
    				cell_slot_or_fallback.m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (cell_slot) {
    				if (cell_slot.p && (!current || dirty[0] & /*sorting, displayedSortedRows, displayedRows, tableCellsByRowId*/ 470286336 | dirty[2] & /*$$scope*/ 1)) {
    					update_slot_base(
    						cell_slot,
    						cell_slot_template,
    						ctx,
    						/*$$scope*/ ctx[62],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[62])
    						: get_slot_changes(cell_slot_template, /*$$scope*/ ctx[62], dirty, get_cell_slot_changes_1),
    						get_cell_slot_context_1
    					);
    				}
    			} else {
    				if (cell_slot_or_fallback && cell_slot_or_fallback.p && (!current || dirty[0] & /*tableCellsByRowId, sorting, displayedSortedRows, displayedRows*/ 470286336)) {
    					cell_slot_or_fallback.p(ctx, !current ? [-1, -1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cell_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cell_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (cell_slot_or_fallback) cell_slot_or_fallback.d(detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(487:14) <TableCell                 on:click=\\\"{() => {                   dispatch('click', { row, cell });                   dispatch('click:cell', cell);                 }}\\\"               >",
    		ctx
    	});

    	return block;
    }

    // (482:17)
    function fallback_block$8(ctx) {
    	let t_value = (/*cell*/ ctx[69].display
    	? /*cell*/ ctx[69].display(/*cell*/ ctx[69].value)
    	: /*cell*/ ctx[69].value) + "";

    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*tableCellsByRowId, sorting, displayedSortedRows, displayedRows*/ 470286336 && t_value !== (t_value = (/*cell*/ ctx[69].display
    			? /*cell*/ ctx[69].display(/*cell*/ ctx[69].value)
    			: /*cell*/ ctx[69].value) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$8.name,
    		type: "fallback",
    		source: "(482:17)                    ",
    		ctx
    	});

    	return block;
    }

    // (473:10) {#each tableCellsByRowId[row.id] as cell, j (cell.key)}
    function create_each_block_1(key_1, ctx) {
    	let first;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$5, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*headers*/ ctx[6][/*j*/ ctx[71]].empty) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(473:10) {#each tableCellsByRowId[row.id] as cell, j (cell.key)}",
    		ctx
    	});

    	return block;
    }

    // (374:8) <TableRow           data-row="{row.id}"           data-parent-row="{expandable ? true : undefined}"           class="{selectedRowIds.includes(row.id)             ? 'bx--data-table--selected'             : ''} {expandedRows[row.id] ? 'bx--expandable-row' : ''} {expandable             ? 'bx--parent-row'             : ''} {expandable && parentRowId === row.id             ? 'bx--expandable-row--hover'             : ''}"           on:click="{({ target }) => {             // forgo "click", "click:row" events if target             // resembles an overflow menu, a checkbox, or radio button             if (               [...target.classList].some((name) =>                 /^bx--(overflow-menu|checkbox|radio-button)/.test(name)               )             ) {               return;             }             dispatch('click', { row });             dispatch('click:row', row);           }}"           on:mouseenter="{() => {             dispatch('mouseenter:row', row);           }}"           on:mouseleave="{() => {             dispatch('mouseleave:row', row);           }}"         >
    function create_default_slot_4$1(ctx) {
    	let t0;
    	let t1;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let if_block0 = /*expandable*/ ctx[4] && create_if_block_6$3(ctx);
    	let if_block1 = /*selectable*/ ctx[5] && create_if_block_3$4(ctx);
    	let each_value_1 = /*tableCellsByRowId*/ ctx[28][/*row*/ ctx[66].id];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*cell*/ ctx[69].key;
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*expandable*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*expandable*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_6$3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*selectable*/ ctx[5]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*selectable*/ 32) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_3$4(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*headers, tableCellsByRowId, sorting, displayedSortedRows, displayedRows*/ 470286400 | dirty[1] & /*dispatch*/ 8 | dirty[2] & /*$$scope*/ 1) {
    				each_value_1 = /*tableCellsByRowId*/ ctx[28][/*row*/ ctx[66].id];
    				validate_each_argument(each_value_1);
    				group_outros();
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block_1, each_1_anchor, get_each_context_1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(374:8) <TableRow           data-row=\\\"{row.id}\\\"           data-parent-row=\\\"{expandable ? true : undefined}\\\"           class=\\\"{selectedRowIds.includes(row.id)             ? 'bx--data-table--selected'             : ''} {expandedRows[row.id] ? 'bx--expandable-row' : ''} {expandable             ? 'bx--parent-row'             : ''} {expandable && parentRowId === row.id             ? 'bx--expandable-row--hover'             : ''}\\\"           on:click=\\\"{({ target }) => {             // forgo \\\"click\\\", \\\"click:row\\\" events if target             // resembles an overflow menu, a checkbox, or radio button             if (               [...target.classList].some((name) =>                 /^bx--(overflow-menu|checkbox|radio-button)/.test(name)               )             ) {               return;             }             dispatch('click', { row });             dispatch('click:row', row);           }}\\\"           on:mouseenter=\\\"{() => {             dispatch('mouseenter:row', row);           }}\\\"           on:mouseleave=\\\"{() => {             dispatch('mouseleave:row', row);           }}\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (507:8) {#if expandable}
    function create_if_block$j(ctx) {
    	let tr;
    	let show_if = /*expandedRows*/ ctx[31][/*row*/ ctx[66].id] && !/*nonExpandableRowIds*/ ctx[13].includes(/*row*/ ctx[66].id);
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = show_if && create_if_block_1$6(ctx);

    	function mouseenter_handler_1() {
    		return /*mouseenter_handler_1*/ ctx[60](/*row*/ ctx[66]);
    	}

    	function mouseleave_handler_1() {
    		return /*mouseleave_handler_1*/ ctx[61](/*row*/ ctx[66]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(tr, "data-child-row", "");
    			toggle_class(tr, "bx--expandable-row", true);
    			add_location(tr, file$o, 507, 10, 17356);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			if (if_block) if_block.m(tr, null);
    			append_dev(tr, t);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(tr, "mouseenter", mouseenter_handler_1, false, false, false),
    					listen_dev(tr, "mouseleave", mouseleave_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*sorting, displayedSortedRows, displayedRows, nonExpandableRowIds*/ 201859072 | dirty[1] & /*expandedRows*/ 1) show_if = /*expandedRows*/ ctx[31][/*row*/ ctx[66].id] && !/*nonExpandableRowIds*/ ctx[13].includes(/*row*/ ctx[66].id);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*sorting, displayedSortedRows, displayedRows, nonExpandableRowIds*/ 201859072 | dirty[1] & /*expandedRows*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(tr, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$j.name,
    		type: "if",
    		source: "(507:8) {#if expandable}",
    		ctx
    	});

    	return block;
    }

    // (520:12) {#if expandedRows[row.id] && !nonExpandableRowIds.includes(row.id)}
    function create_if_block_1$6(ctx) {
    	let tablecell;
    	let current;

    	tablecell = new TableCell$1({
    			props: {
    				colspan: /*selectable*/ ctx[5]
    				? /*headers*/ ctx[6].length + 2
    				: /*headers*/ ctx[6].length + 1,
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tablecell.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tablecell, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tablecell_changes = {};

    			if (dirty[0] & /*selectable, headers*/ 96) tablecell_changes.colspan = /*selectable*/ ctx[5]
    			? /*headers*/ ctx[6].length + 2
    			: /*headers*/ ctx[6].length + 1;

    			if (dirty[0] & /*sorting, displayedSortedRows, displayedRows*/ 201850880 | dirty[2] & /*$$scope*/ 1) {
    				tablecell_changes.$$scope = { dirty, ctx };
    			}

    			tablecell.$set(tablecell_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablecell.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablecell.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tablecell, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(520:12) {#if expandedRows[row.id] && !nonExpandableRowIds.includes(row.id)}",
    		ctx
    	});

    	return block;
    }

    // (521:14) <TableCell                 colspan="{selectable ? headers.length + 2 : headers.length + 1}"               >
    function create_default_slot_3$1(ctx) {
    	let div;
    	let current;
    	const expanded_row_slot_template = /*#slots*/ ctx[48]["expanded-row"];
    	const expanded_row_slot = create_slot(expanded_row_slot_template, ctx, /*$$scope*/ ctx[62], get_expanded_row_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (expanded_row_slot) expanded_row_slot.c();
    			toggle_class(div, "bx--child-row-inner-container", true);
    			add_location(div, file$o, 523, 16, 17965);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (expanded_row_slot) {
    				expanded_row_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (expanded_row_slot) {
    				if (expanded_row_slot.p && (!current || dirty[0] & /*sorting, displayedSortedRows, displayedRows*/ 201850880 | dirty[2] & /*$$scope*/ 1)) {
    					update_slot_base(
    						expanded_row_slot,
    						expanded_row_slot_template,
    						ctx,
    						/*$$scope*/ ctx[62],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[62])
    						: get_slot_changes(expanded_row_slot_template, /*$$scope*/ ctx[62], dirty, get_expanded_row_slot_changes),
    						get_expanded_row_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(expanded_row_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(expanded_row_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (expanded_row_slot) expanded_row_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(521:14) <TableCell                 colspan=\\\"{selectable ? headers.length + 2 : headers.length + 1}\\\"               >",
    		ctx
    	});

    	return block;
    }

    // (373:6) {#each sorting ? displayedSortedRows : displayedRows as row, i (row.id)}
    function create_each_block$2(key_1, ctx) {
    	let first;
    	let tablerow;
    	let t;
    	let if_block_anchor;
    	let current;

    	function click_handler_4(...args) {
    		return /*click_handler_4*/ ctx[57](/*row*/ ctx[66], ...args);
    	}

    	function mouseenter_handler() {
    		return /*mouseenter_handler*/ ctx[58](/*row*/ ctx[66]);
    	}

    	function mouseleave_handler() {
    		return /*mouseleave_handler*/ ctx[59](/*row*/ ctx[66]);
    	}

    	tablerow = new TableRow$1({
    			props: {
    				"data-row": /*row*/ ctx[66].id,
    				"data-parent-row": /*expandable*/ ctx[4] ? true : undefined,
    				class: "" + ((/*selectedRowIds*/ ctx[3].includes(/*row*/ ctx[66].id)
    				? 'bx--data-table--selected'
    				: '') + " " + (/*expandedRows*/ ctx[31][/*row*/ ctx[66].id]
    				? 'bx--expandable-row'
    				: '') + " " + (/*expandable*/ ctx[4] ? 'bx--parent-row' : '') + " " + (/*expandable*/ ctx[4] && /*parentRowId*/ ctx[23] === /*row*/ ctx[66].id
    				? 'bx--expandable-row--hover'
    				: '')),
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tablerow.$on("click", click_handler_4);
    	tablerow.$on("mouseenter", mouseenter_handler);
    	tablerow.$on("mouseleave", mouseleave_handler);
    	let if_block = /*expandable*/ ctx[4] && create_if_block$j(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(tablerow.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(tablerow, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const tablerow_changes = {};
    			if (dirty[0] & /*sorting, displayedSortedRows, displayedRows*/ 201850880) tablerow_changes["data-row"] = /*row*/ ctx[66].id;
    			if (dirty[0] & /*expandable*/ 16) tablerow_changes["data-parent-row"] = /*expandable*/ ctx[4] ? true : undefined;

    			if (dirty[0] & /*selectedRowIds, sorting, displayedSortedRows, displayedRows, expandable, parentRowId*/ 210239512 | dirty[1] & /*expandedRows*/ 1) tablerow_changes.class = "" + ((/*selectedRowIds*/ ctx[3].includes(/*row*/ ctx[66].id)
    			? 'bx--data-table--selected'
    			: '') + " " + (/*expandedRows*/ ctx[31][/*row*/ ctx[66].id]
    			? 'bx--expandable-row'
    			: '') + " " + (/*expandable*/ ctx[4] ? 'bx--parent-row' : '') + " " + (/*expandable*/ ctx[4] && /*parentRowId*/ ctx[23] === /*row*/ ctx[66].id
    			? 'bx--expandable-row--hover'
    			: ''));

    			if (dirty[0] & /*tableCellsByRowId, sorting, displayedSortedRows, displayedRows, headers, radio, selectedRowIds, nonSelectableRowIds, selectable, nonExpandableRowIds, expandedRowIds, expandable*/ 470376572 | dirty[1] & /*expandedRows*/ 1 | dirty[2] & /*$$scope*/ 1) {
    				tablerow_changes.$$scope = { dirty, ctx };
    			}

    			tablerow.$set(tablerow_changes);

    			if (/*expandable*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*expandable*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$j(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablerow.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablerow.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(tablerow, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(373:6) {#each sorting ? displayedSortedRows : displayedRows as row, i (row.id)}",
    		ctx
    	});

    	return block;
    }

    // (372:4) <TableBody>
    function create_default_slot_2$3(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;

    	let each_value = /*sorting*/ ctx[19]
    	? /*displayedSortedRows*/ ctx[26]
    	: /*displayedRows*/ ctx[27];

    	validate_each_argument(each_value);
    	const get_key = ctx => /*row*/ ctx[66].id;
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*nonExpandableRowIds, sorting, displayedSortedRows, displayedRows, parentRowId, selectable, headers, expandable, selectedRowIds, tableCellsByRowId, radio, nonSelectableRowIds, expandedRowIds*/ 478765180 | dirty[1] & /*expandedRows, dispatch*/ 9 | dirty[2] & /*$$scope*/ 1) {
    				each_value = /*sorting*/ ctx[19]
    				? /*displayedSortedRows*/ ctx[26]
    				: /*displayedRows*/ ctx[27];

    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$2, each_1_anchor, get_each_context$2);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(372:4) <TableBody>",
    		ctx
    	});

    	return block;
    }

    // (277:2) <Table     zebra="{zebra}"     size="{size}"     stickyHeader="{stickyHeader}"     sortable="{sortable}"     useStaticWidth="{useStaticWidth}"     tableStyle="{hasCustomHeaderWidth && 'table-layout: fixed'}"   >
    function create_default_slot_1$3(ctx) {
    	let tablehead;
    	let t;
    	let tablebody;
    	let current;

    	tablehead = new TableHead$1({
    			props: {
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tablebody = new TableBody$1({
    			props: {
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tablehead.$$.fragment);
    			t = space();
    			create_component(tablebody.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tablehead, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(tablebody, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tablehead_changes = {};

    			if (dirty[0] & /*headers, sortable, sortKey, sortDirection, selectAll, indeterminate, refSelectAll, selectedRowIds, selectableRowIds, batchSelection, radio, selectable, expanded, expandedRowIds, expandableRowIds, batchExpansion, expandable*/ 1634785407 | dirty[1] & /*thKeys*/ 2 | dirty[2] & /*$$scope*/ 1) {
    				tablehead_changes.$$scope = { dirty, ctx };
    			}

    			tablehead.$set(tablehead_changes);
    			const tablebody_changes = {};

    			if (dirty[0] & /*sorting, displayedSortedRows, displayedRows, nonExpandableRowIds, parentRowId, selectable, headers, expandable, selectedRowIds, tableCellsByRowId, radio, nonSelectableRowIds, expandedRowIds*/ 478765180 | dirty[1] & /*expandedRows*/ 1 | dirty[2] & /*$$scope*/ 1) {
    				tablebody_changes.$$scope = { dirty, ctx };
    			}

    			tablebody.$set(tablebody_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablehead.$$.fragment, local);
    			transition_in(tablebody.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablehead.$$.fragment, local);
    			transition_out(tablebody.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tablehead, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(tablebody, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(277:2) <Table     zebra=\\\"{zebra}\\\"     size=\\\"{size}\\\"     stickyHeader=\\\"{stickyHeader}\\\"     sortable=\\\"{sortable}\\\"     useStaticWidth=\\\"{useStaticWidth}\\\"     tableStyle=\\\"{hasCustomHeaderWidth && 'table-layout: fixed'}\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (261:0) <TableContainer useStaticWidth="{useStaticWidth}" {...$$restProps}>
    function create_default_slot$5(ctx) {
    	let t0;
    	let t1;
    	let table;
    	let current;
    	let if_block = (/*title*/ ctx[8] || /*$$slots*/ ctx[38].title || /*description*/ ctx[9] || /*$$slots*/ ctx[38].description) && create_if_block_13(ctx);
    	const default_slot_template = /*#slots*/ ctx[48].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[62], null);

    	table = new Table$1({
    			props: {
    				zebra: /*zebra*/ ctx[10],
    				size: /*size*/ ctx[7],
    				stickyHeader: /*stickyHeader*/ ctx[17],
    				sortable: /*sortable*/ ctx[11],
    				useStaticWidth: /*useStaticWidth*/ ctx[18],
    				tableStyle: /*hasCustomHeaderWidth*/ ctx[25] && 'table-layout: fixed',
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[8] || /*$$slots*/ ctx[38].title || /*description*/ ctx[9] || /*$$slots*/ ctx[38].description) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*title, description*/ 768 | dirty[1] & /*$$slots*/ 128) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_13(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[2] & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[62],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[62])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[62], dirty, null),
    						null
    					);
    				}
    			}

    			const table_changes = {};
    			if (dirty[0] & /*zebra*/ 1024) table_changes.zebra = /*zebra*/ ctx[10];
    			if (dirty[0] & /*size*/ 128) table_changes.size = /*size*/ ctx[7];
    			if (dirty[0] & /*stickyHeader*/ 131072) table_changes.stickyHeader = /*stickyHeader*/ ctx[17];
    			if (dirty[0] & /*sortable*/ 2048) table_changes.sortable = /*sortable*/ ctx[11];
    			if (dirty[0] & /*useStaticWidth*/ 262144) table_changes.useStaticWidth = /*useStaticWidth*/ ctx[18];
    			if (dirty[0] & /*hasCustomHeaderWidth*/ 33554432) table_changes.tableStyle = /*hasCustomHeaderWidth*/ ctx[25] && 'table-layout: fixed';

    			if (dirty[0] & /*sorting, displayedSortedRows, displayedRows, nonExpandableRowIds, parentRowId, selectable, headers, expandable, selectedRowIds, tableCellsByRowId, radio, nonSelectableRowIds, expandedRowIds, sortable, sortKey, sortDirection, selectAll, indeterminate, refSelectAll, selectableRowIds, batchSelection, expanded, expandableRowIds, batchExpansion*/ 2113534079 | dirty[1] & /*expandedRows, thKeys*/ 3 | dirty[2] & /*$$scope*/ 1) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(261:0) <TableContainer useStaticWidth=\\\"{useStaticWidth}\\\" {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let tablecontainer;
    	let current;

    	const tablecontainer_spread_levels = [
    		{
    			useStaticWidth: /*useStaticWidth*/ ctx[18]
    		},
    		/*$$restProps*/ ctx[37]
    	];

    	let tablecontainer_props = {
    		$$slots: { default: [create_default_slot$5] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < tablecontainer_spread_levels.length; i += 1) {
    		tablecontainer_props = assign(tablecontainer_props, tablecontainer_spread_levels[i]);
    	}

    	tablecontainer = new TableContainer$1({
    			props: tablecontainer_props,
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tablecontainer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(tablecontainer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tablecontainer_changes = (dirty[0] & /*useStaticWidth*/ 262144 | dirty[1] & /*$$restProps*/ 64)
    			? get_spread_update(tablecontainer_spread_levels, [
    					dirty[0] & /*useStaticWidth*/ 262144 && {
    						useStaticWidth: /*useStaticWidth*/ ctx[18]
    					},
    					dirty[1] & /*$$restProps*/ 64 && get_spread_object(/*$$restProps*/ ctx[37])
    				])
    			: {};

    			if (dirty[0] & /*zebra, size, stickyHeader, sortable, useStaticWidth, hasCustomHeaderWidth, sorting, displayedSortedRows, displayedRows, nonExpandableRowIds, parentRowId, selectable, headers, expandable, selectedRowIds, tableCellsByRowId, radio, nonSelectableRowIds, expandedRowIds, sortKey, sortDirection, selectAll, indeterminate, refSelectAll, selectableRowIds, batchSelection, expanded, expandableRowIds, batchExpansion, description, title*/ 2147483647 | dirty[1] & /*expandedRows, thKeys, $$slots*/ 131 | dirty[2] & /*$$scope*/ 1) {
    				tablecontainer_changes.$$scope = { dirty, ctx };
    			}

    			tablecontainer.$set(tablecontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablecontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablecontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tablecontainer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let thKeys;
    	let expandedRows;
    	let rowIds;
    	let expandableRowIds;
    	let selectableRowIds;
    	let selectAll;
    	let indeterminate;
    	let headerKeys;
    	let tableCellsByRowId;
    	let sortedRows;
    	let ascending;
    	let sorting;
    	let sortingHeader;
    	let displayedRows;
    	let displayedSortedRows;
    	let hasCustomHeaderWidth;

    	const omit_props_names = [
    		"headers","rows","size","title","description","zebra","sortable","sortKey","sortDirection","expandable","batchExpansion","expandedRowIds","nonExpandableRowIds","radio","selectable","batchSelection","selectedRowIds","nonSelectableRowIds","stickyHeader","useStaticWidth","pageSize","page"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $tableRows;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DataTable', slots, ['title','description','default','cell-header','cell','expanded-row']);
    	const $$slots = compute_slots(slots);
    	let { headers = [] } = $$props;
    	let { rows = [] } = $$props;
    	let { size = undefined } = $$props;
    	let { title = "" } = $$props;
    	let { description = "" } = $$props;
    	let { zebra = false } = $$props;
    	let { sortable = false } = $$props;
    	let { sortKey = null } = $$props;
    	let { sortDirection = "none" } = $$props;
    	let { expandable = false } = $$props;
    	let { batchExpansion = false } = $$props;
    	let { expandedRowIds = [] } = $$props;
    	let { nonExpandableRowIds = [] } = $$props;
    	let { radio = false } = $$props;
    	let { selectable = false } = $$props;
    	let { batchSelection = false } = $$props;
    	let { selectedRowIds = [] } = $$props;
    	let { nonSelectableRowIds = [] } = $$props;
    	let { stickyHeader = false } = $$props;
    	let { useStaticWidth = false } = $$props;
    	let { pageSize = 0 } = $$props;
    	let { page = 0 } = $$props;

    	const sortDirectionMap = {
    		none: "ascending",
    		ascending: "descending",
    		descending: "none"
    	};

    	const dispatch = createEventDispatcher();
    	const batchSelectedIds = writable(false);
    	const tableRows = writable(rows);
    	validate_store(tableRows, 'tableRows');
    	component_subscribe($$self, tableRows, value => $$invalidate(47, $tableRows = value));

    	const resolvePath = (object, path) => {
    		if (path in object) return object[path];
    		return path.split(/[\.\[\]\'\"]/).filter(p => p).reduce((o, p) => o && typeof o === "object" ? o[p] : o, object);
    	};

    	setContext("DataTable", {
    		batchSelectedIds,
    		tableRows,
    		resetSelectedRowIds: () => {
    			$$invalidate(30, selectAll = false);
    			$$invalidate(3, selectedRowIds = []);
    			if (refSelectAll) $$invalidate(24, refSelectAll.checked = false, refSelectAll);
    		}
    	});

    	let expanded = false;
    	let parentRowId = null;
    	let refSelectAll = null;

    	const getDisplayedRows = (rows, page, pageSize) => page && pageSize
    	? rows.slice((page - 1) * pageSize, page * pageSize)
    	: rows;

    	/** @type {(header: DataTableHeader) => undefined | string} */
    	const formatHeaderWidth = header => {
    		const styles = [
    			header.width && `width: ${header.width}`,
    			header.minWidth && `min-width: ${header.minWidth}`
    		].filter(Boolean);

    		if (styles.length === 0) return undefined;
    		return styles.join(";");
    	};

    	const click_handler = () => {
    		$$invalidate(22, expanded = !expanded);
    		$$invalidate(2, expandedRowIds = expanded ? expandableRowIds : []);
    		dispatch('click:header--expand', { expanded });
    	};

    	function inlinecheckbox_ref_binding(value) {
    		refSelectAll = value;
    		$$invalidate(24, refSelectAll);
    	}

    	const change_handler = e => {
    		dispatch('click:header--select', {
    			indeterminate,
    			selected: !indeterminate && e.target.checked
    		});

    		if (indeterminate) {
    			e.target.checked = false;
    			$$invalidate(30, selectAll = false);
    			$$invalidate(3, selectedRowIds = []);
    			return;
    		}

    		if (e.target.checked) {
    			$$invalidate(3, selectedRowIds = selectableRowIds);
    		} else {
    			$$invalidate(3, selectedRowIds = []);
    		}
    	};

    	const click_handler_1 = header => {
    		dispatch('click', { header });

    		if (header.sort === false) {
    			dispatch('click:header', { header });
    		} else {
    			let currentSortDirection = sortKey === header.key ? sortDirection : 'none';
    			$$invalidate(1, sortDirection = sortDirectionMap[currentSortDirection]);
    			$$invalidate(0, sortKey = sortDirection === 'none' ? null : thKeys[header.key]);
    			dispatch('click:header', { header, sortDirection });
    		}
    	};

    	const click_handler_2 = row => {
    		const rowExpanded = !!expandedRows[row.id];

    		$$invalidate(2, expandedRowIds = rowExpanded
    		? expandedRowIds.filter(id => id !== row.id)
    		: [...expandedRowIds, row.id]);

    		dispatch('click:row--expand', { row, expanded: !rowExpanded });
    	};

    	const change_handler_1 = row => {
    		$$invalidate(3, selectedRowIds = [row.id]);
    		dispatch('click:row--select', { row, selected: true });
    	};

    	const change_handler_2 = row => {
    		if (selectedRowIds.includes(row.id)) {
    			$$invalidate(3, selectedRowIds = selectedRowIds.filter(id => id !== row.id));
    			dispatch('click:row--select', { row, selected: false });
    		} else {
    			$$invalidate(3, selectedRowIds = [...selectedRowIds, row.id]);
    			dispatch('click:row--select', { row, selected: true });
    		}
    	};

    	const click_handler_3 = (row, cell) => {
    		dispatch('click', { row, cell });
    		dispatch('click:cell', cell);
    	};

    	const click_handler_4 = (row, { target }) => {
    		// forgo "click", "click:row" events if target
    		// resembles an overflow menu, a checkbox, or radio button
    		if ([...target.classList].some(name => (/^bx--(overflow-menu|checkbox|radio-button)/).test(name))) {
    			return;
    		}

    		dispatch('click', { row });
    		dispatch('click:row', row);
    	};

    	const mouseenter_handler = row => {
    		dispatch('mouseenter:row', row);
    	};

    	const mouseleave_handler = row => {
    		dispatch('mouseleave:row', row);
    	};

    	const mouseenter_handler_1 = row => {
    		if (nonExpandableRowIds.includes(row.id)) return;
    		$$invalidate(23, parentRowId = row.id);
    	};

    	const mouseleave_handler_1 = row => {
    		if (nonExpandableRowIds.includes(row.id)) return;
    		$$invalidate(23, parentRowId = null);
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(37, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('headers' in $$new_props) $$invalidate(6, headers = $$new_props.headers);
    		if ('rows' in $$new_props) $$invalidate(39, rows = $$new_props.rows);
    		if ('size' in $$new_props) $$invalidate(7, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(8, title = $$new_props.title);
    		if ('description' in $$new_props) $$invalidate(9, description = $$new_props.description);
    		if ('zebra' in $$new_props) $$invalidate(10, zebra = $$new_props.zebra);
    		if ('sortable' in $$new_props) $$invalidate(11, sortable = $$new_props.sortable);
    		if ('sortKey' in $$new_props) $$invalidate(0, sortKey = $$new_props.sortKey);
    		if ('sortDirection' in $$new_props) $$invalidate(1, sortDirection = $$new_props.sortDirection);
    		if ('expandable' in $$new_props) $$invalidate(4, expandable = $$new_props.expandable);
    		if ('batchExpansion' in $$new_props) $$invalidate(12, batchExpansion = $$new_props.batchExpansion);
    		if ('expandedRowIds' in $$new_props) $$invalidate(2, expandedRowIds = $$new_props.expandedRowIds);
    		if ('nonExpandableRowIds' in $$new_props) $$invalidate(13, nonExpandableRowIds = $$new_props.nonExpandableRowIds);
    		if ('radio' in $$new_props) $$invalidate(14, radio = $$new_props.radio);
    		if ('selectable' in $$new_props) $$invalidate(5, selectable = $$new_props.selectable);
    		if ('batchSelection' in $$new_props) $$invalidate(15, batchSelection = $$new_props.batchSelection);
    		if ('selectedRowIds' in $$new_props) $$invalidate(3, selectedRowIds = $$new_props.selectedRowIds);
    		if ('nonSelectableRowIds' in $$new_props) $$invalidate(16, nonSelectableRowIds = $$new_props.nonSelectableRowIds);
    		if ('stickyHeader' in $$new_props) $$invalidate(17, stickyHeader = $$new_props.stickyHeader);
    		if ('useStaticWidth' in $$new_props) $$invalidate(18, useStaticWidth = $$new_props.useStaticWidth);
    		if ('pageSize' in $$new_props) $$invalidate(40, pageSize = $$new_props.pageSize);
    		if ('page' in $$new_props) $$invalidate(41, page = $$new_props.page);
    		if ('$$scope' in $$new_props) $$invalidate(62, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		headers,
    		rows,
    		size,
    		title,
    		description,
    		zebra,
    		sortable,
    		sortKey,
    		sortDirection,
    		expandable,
    		batchExpansion,
    		expandedRowIds,
    		nonExpandableRowIds,
    		radio,
    		selectable,
    		batchSelection,
    		selectedRowIds,
    		nonSelectableRowIds,
    		stickyHeader,
    		useStaticWidth,
    		pageSize,
    		page,
    		createEventDispatcher,
    		setContext,
    		writable,
    		ChevronRight: ChevronRight$1,
    		InlineCheckbox: InlineCheckbox$1,
    		RadioButton: RadioButton$1,
    		Table: Table$1,
    		TableBody: TableBody$1,
    		TableCell: TableCell$1,
    		TableContainer: TableContainer$1,
    		TableHead: TableHead$1,
    		TableHeader: TableHeader$1,
    		TableRow: TableRow$1,
    		sortDirectionMap,
    		dispatch,
    		batchSelectedIds,
    		tableRows,
    		resolvePath,
    		expanded,
    		parentRowId,
    		refSelectAll,
    		getDisplayedRows,
    		formatHeaderWidth,
    		hasCustomHeaderWidth,
    		sortedRows,
    		displayedSortedRows,
    		displayedRows,
    		ascending,
    		sortingHeader,
    		sorting,
    		headerKeys,
    		tableCellsByRowId,
    		expandableRowIds,
    		selectableRowIds,
    		indeterminate,
    		selectAll,
    		rowIds,
    		expandedRows,
    		thKeys,
    		$tableRows
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('headers' in $$props) $$invalidate(6, headers = $$new_props.headers);
    		if ('rows' in $$props) $$invalidate(39, rows = $$new_props.rows);
    		if ('size' in $$props) $$invalidate(7, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(8, title = $$new_props.title);
    		if ('description' in $$props) $$invalidate(9, description = $$new_props.description);
    		if ('zebra' in $$props) $$invalidate(10, zebra = $$new_props.zebra);
    		if ('sortable' in $$props) $$invalidate(11, sortable = $$new_props.sortable);
    		if ('sortKey' in $$props) $$invalidate(0, sortKey = $$new_props.sortKey);
    		if ('sortDirection' in $$props) $$invalidate(1, sortDirection = $$new_props.sortDirection);
    		if ('expandable' in $$props) $$invalidate(4, expandable = $$new_props.expandable);
    		if ('batchExpansion' in $$props) $$invalidate(12, batchExpansion = $$new_props.batchExpansion);
    		if ('expandedRowIds' in $$props) $$invalidate(2, expandedRowIds = $$new_props.expandedRowIds);
    		if ('nonExpandableRowIds' in $$props) $$invalidate(13, nonExpandableRowIds = $$new_props.nonExpandableRowIds);
    		if ('radio' in $$props) $$invalidate(14, radio = $$new_props.radio);
    		if ('selectable' in $$props) $$invalidate(5, selectable = $$new_props.selectable);
    		if ('batchSelection' in $$props) $$invalidate(15, batchSelection = $$new_props.batchSelection);
    		if ('selectedRowIds' in $$props) $$invalidate(3, selectedRowIds = $$new_props.selectedRowIds);
    		if ('nonSelectableRowIds' in $$props) $$invalidate(16, nonSelectableRowIds = $$new_props.nonSelectableRowIds);
    		if ('stickyHeader' in $$props) $$invalidate(17, stickyHeader = $$new_props.stickyHeader);
    		if ('useStaticWidth' in $$props) $$invalidate(18, useStaticWidth = $$new_props.useStaticWidth);
    		if ('pageSize' in $$props) $$invalidate(40, pageSize = $$new_props.pageSize);
    		if ('page' in $$props) $$invalidate(41, page = $$new_props.page);
    		if ('expanded' in $$props) $$invalidate(22, expanded = $$new_props.expanded);
    		if ('parentRowId' in $$props) $$invalidate(23, parentRowId = $$new_props.parentRowId);
    		if ('refSelectAll' in $$props) $$invalidate(24, refSelectAll = $$new_props.refSelectAll);
    		if ('hasCustomHeaderWidth' in $$props) $$invalidate(25, hasCustomHeaderWidth = $$new_props.hasCustomHeaderWidth);
    		if ('sortedRows' in $$props) $$invalidate(42, sortedRows = $$new_props.sortedRows);
    		if ('displayedSortedRows' in $$props) $$invalidate(26, displayedSortedRows = $$new_props.displayedSortedRows);
    		if ('displayedRows' in $$props) $$invalidate(27, displayedRows = $$new_props.displayedRows);
    		if ('ascending' in $$props) $$invalidate(43, ascending = $$new_props.ascending);
    		if ('sortingHeader' in $$props) $$invalidate(44, sortingHeader = $$new_props.sortingHeader);
    		if ('sorting' in $$props) $$invalidate(19, sorting = $$new_props.sorting);
    		if ('headerKeys' in $$props) $$invalidate(45, headerKeys = $$new_props.headerKeys);
    		if ('tableCellsByRowId' in $$props) $$invalidate(28, tableCellsByRowId = $$new_props.tableCellsByRowId);
    		if ('expandableRowIds' in $$props) $$invalidate(20, expandableRowIds = $$new_props.expandableRowIds);
    		if ('selectableRowIds' in $$props) $$invalidate(21, selectableRowIds = $$new_props.selectableRowIds);
    		if ('indeterminate' in $$props) $$invalidate(29, indeterminate = $$new_props.indeterminate);
    		if ('selectAll' in $$props) $$invalidate(30, selectAll = $$new_props.selectAll);
    		if ('rowIds' in $$props) $$invalidate(46, rowIds = $$new_props.rowIds);
    		if ('expandedRows' in $$props) $$invalidate(31, expandedRows = $$new_props.expandedRows);
    		if ('thKeys' in $$props) $$invalidate(32, thKeys = $$new_props.thKeys);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*headers*/ 64) {
    			$$invalidate(32, thKeys = headers.reduce((a, c) => ({ ...a, [c.key]: c.key }), {}));
    		}

    		if ($$self.$$.dirty[0] & /*expandedRowIds*/ 4) {
    			$$invalidate(31, expandedRows = expandedRowIds.reduce((a, id) => ({ ...a, [id]: true }), {}));
    		}

    		if ($$self.$$.dirty[0] & /*selectedRowIds*/ 8) {
    			batchSelectedIds.set(selectedRowIds);
    		}

    		if ($$self.$$.dirty[0] & /*headers*/ 64) {
    			$$invalidate(45, headerKeys = headers.map(({ key }) => key));
    		}

    		if ($$self.$$.dirty[0] & /*headers*/ 64 | $$self.$$.dirty[1] & /*rows, headerKeys*/ 16640) {
    			$$invalidate(28, tableCellsByRowId = rows.reduce(
    				(rows, row) => {
    					rows[row.id] = headerKeys.map((key, index) => ({
    						key,
    						value: resolvePath(row, key),
    						display: headers[index].display
    					}));

    					return rows;
    				},
    				{}
    			));
    		}

    		if ($$self.$$.dirty[1] & /*rows*/ 256) {
    			set_store_value(tableRows, $tableRows = rows, $tableRows);
    		}

    		if ($$self.$$.dirty[1] & /*$tableRows*/ 65536) {
    			$$invalidate(46, rowIds = $tableRows.map(row => row.id));
    		}

    		if ($$self.$$.dirty[0] & /*nonExpandableRowIds*/ 8192 | $$self.$$.dirty[1] & /*rowIds*/ 32768) {
    			$$invalidate(20, expandableRowIds = rowIds.filter(id => !nonExpandableRowIds.includes(id)));
    		}

    		if ($$self.$$.dirty[0] & /*nonSelectableRowIds*/ 65536 | $$self.$$.dirty[1] & /*rowIds*/ 32768) {
    			$$invalidate(21, selectableRowIds = rowIds.filter(id => !nonSelectableRowIds.includes(id)));
    		}

    		if ($$self.$$.dirty[0] & /*selectableRowIds, selectedRowIds*/ 2097160) {
    			$$invalidate(30, selectAll = selectableRowIds.length > 0 && selectedRowIds.length === selectableRowIds.length);
    		}

    		if ($$self.$$.dirty[0] & /*selectedRowIds, selectableRowIds*/ 2097160) {
    			$$invalidate(29, indeterminate = selectedRowIds.length > 0 && selectedRowIds.length < selectableRowIds.length);
    		}

    		if ($$self.$$.dirty[0] & /*batchExpansion, expandedRowIds, expandableRowIds*/ 1052676) {
    			if (batchExpansion) {
    				$$invalidate(4, expandable = true);
    				$$invalidate(22, expanded = expandedRowIds.length === expandableRowIds.length);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*radio, batchSelection*/ 49152) {
    			if (radio || batchSelection) $$invalidate(5, selectable = true);
    		}

    		if ($$self.$$.dirty[1] & /*$tableRows*/ 65536) {
    			$$invalidate(42, sortedRows = [...$tableRows]);
    		}

    		if ($$self.$$.dirty[0] & /*sortDirection*/ 2) {
    			$$invalidate(43, ascending = sortDirection === "ascending");
    		}

    		if ($$self.$$.dirty[0] & /*sortable, sortKey*/ 2049) {
    			$$invalidate(19, sorting = sortable && sortKey != null);
    		}

    		if ($$self.$$.dirty[0] & /*headers, sortKey*/ 65) {
    			$$invalidate(44, sortingHeader = headers.find(header => header.key === sortKey));
    		}

    		if ($$self.$$.dirty[0] & /*sorting, sortDirection, sortKey*/ 524291 | $$self.$$.dirty[1] & /*$tableRows, ascending, sortingHeader*/ 77824) {
    			if (sorting) {
    				if (sortDirection === "none") {
    					$$invalidate(42, sortedRows = $tableRows);
    				} else {
    					$$invalidate(42, sortedRows = [...$tableRows].sort((a, b) => {
    						const itemA = ascending
    						? resolvePath(a, sortKey)
    						: resolvePath(b, sortKey);

    						const itemB = ascending
    						? resolvePath(b, sortKey)
    						: resolvePath(a, sortKey);

    						if (sortingHeader?.sort) return sortingHeader.sort(itemA, itemB);
    						if (typeof itemA === "number" && typeof itemB === "number") return itemA - itemB;
    						if ([itemA, itemB].every(item => !item && item !== 0)) return 0;
    						if (!itemA && itemA !== 0) return ascending ? 1 : -1;
    						if (!itemB && itemB !== 0) return ascending ? -1 : 1;
    						return itemA.toString().localeCompare(itemB.toString(), "en", { numeric: true });
    					}));
    				}
    			}
    		}

    		if ($$self.$$.dirty[1] & /*$tableRows, page, pageSize*/ 67072) {
    			$$invalidate(27, displayedRows = getDisplayedRows($tableRows, page, pageSize));
    		}

    		if ($$self.$$.dirty[1] & /*sortedRows, page, pageSize*/ 3584) {
    			$$invalidate(26, displayedSortedRows = getDisplayedRows(sortedRows, page, pageSize));
    		}

    		if ($$self.$$.dirty[0] & /*headers*/ 64) {
    			$$invalidate(25, hasCustomHeaderWidth = headers.some(header => header.width || header.minWidth));
    		}
    	};

    	return [
    		sortKey,
    		sortDirection,
    		expandedRowIds,
    		selectedRowIds,
    		expandable,
    		selectable,
    		headers,
    		size,
    		title,
    		description,
    		zebra,
    		sortable,
    		batchExpansion,
    		nonExpandableRowIds,
    		radio,
    		batchSelection,
    		nonSelectableRowIds,
    		stickyHeader,
    		useStaticWidth,
    		sorting,
    		expandableRowIds,
    		selectableRowIds,
    		expanded,
    		parentRowId,
    		refSelectAll,
    		hasCustomHeaderWidth,
    		displayedSortedRows,
    		displayedRows,
    		tableCellsByRowId,
    		indeterminate,
    		selectAll,
    		expandedRows,
    		thKeys,
    		sortDirectionMap,
    		dispatch,
    		tableRows,
    		formatHeaderWidth,
    		$$restProps,
    		$$slots,
    		rows,
    		pageSize,
    		page,
    		sortedRows,
    		ascending,
    		sortingHeader,
    		headerKeys,
    		rowIds,
    		$tableRows,
    		slots,
    		click_handler,
    		inlinecheckbox_ref_binding,
    		change_handler,
    		click_handler_1,
    		click_handler_2,
    		change_handler_1,
    		change_handler_2,
    		click_handler_3,
    		click_handler_4,
    		mouseenter_handler,
    		mouseleave_handler,
    		mouseenter_handler_1,
    		mouseleave_handler_1,
    		$$scope
    	];
    }

    class DataTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$s,
    			create_fragment$s,
    			safe_not_equal,
    			{
    				headers: 6,
    				rows: 39,
    				size: 7,
    				title: 8,
    				description: 9,
    				zebra: 10,
    				sortable: 11,
    				sortKey: 0,
    				sortDirection: 1,
    				expandable: 4,
    				batchExpansion: 12,
    				expandedRowIds: 2,
    				nonExpandableRowIds: 13,
    				radio: 14,
    				selectable: 5,
    				batchSelection: 15,
    				selectedRowIds: 3,
    				nonSelectableRowIds: 16,
    				stickyHeader: 17,
    				useStaticWidth: 18,
    				pageSize: 40,
    				page: 41
    			},
    			null,
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DataTable",
    			options,
    			id: create_fragment$s.name
    		});
    	}

    	get headers() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set headers(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rows() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zebra() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zebra(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sortable() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortable(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sortKey() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortKey(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sortDirection() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortDirection(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expandable() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expandable(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get batchExpansion() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set batchExpansion(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expandedRowIds() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expandedRowIds(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nonExpandableRowIds() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nonExpandableRowIds(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get radio() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set radio(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectable() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectable(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get batchSelection() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set batchSelection(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedRowIds() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedRowIds(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nonSelectableRowIds() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nonSelectableRowIds(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stickyHeader() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stickyHeader(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get useStaticWidth() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set useStaticWidth(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageSize() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageSize(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get page() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set page(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var DataTable$1 = DataTable;

    /* node_modules/carbon-components-svelte/src/DataTable/Toolbar.svelte generated by Svelte v3.55.1 */
    const file$n = "node_modules/carbon-components-svelte/src/DataTable/Toolbar.svelte";

    function create_fragment$r(ctx) {
    	let section;
    	let section_style_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	let section_levels = [
    		{ "aria-label": "data table toolbar" },
    		/*$$restProps*/ ctx[2],
    		{
    			style: section_style_value = "z-index: 1; " + /*$$restProps*/ ctx[2].style
    		}
    	];

    	let section_data = {};

    	for (let i = 0; i < section_levels.length; i += 1) {
    		section_data = assign(section_data, section_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			if (default_slot) default_slot.c();
    			set_attributes(section, section_data);
    			toggle_class(section, "bx--table-toolbar", true);
    			toggle_class(section, "bx--table-toolbar--small", /*size*/ ctx[0] === 'sm');
    			toggle_class(section, "bx--table-toolbar--normal", /*size*/ ctx[0] === 'default');
    			add_location(section, file$n, 23, 0, 474);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);

    			if (default_slot) {
    				default_slot.m(section, null);
    			}

    			/*section_binding*/ ctx[5](section);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(section, section_data = get_spread_update(section_levels, [
    				{ "aria-label": "data table toolbar" },
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*$$restProps*/ 4 && section_style_value !== (section_style_value = "z-index: 1; " + /*$$restProps*/ ctx[2].style)) && { style: section_style_value }
    			]));

    			toggle_class(section, "bx--table-toolbar", true);
    			toggle_class(section, "bx--table-toolbar--small", /*size*/ ctx[0] === 'sm');
    			toggle_class(section, "bx--table-toolbar--normal", /*size*/ ctx[0] === 'default');
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (default_slot) default_slot.d(detaching);
    			/*section_binding*/ ctx[5](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	const omit_props_names = ["size"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Toolbar', slots, ['default']);
    	let { size = "default" } = $$props;
    	let ref = null;
    	const overflowVisible = writable(false);

    	setContext("Toolbar", {
    		overflowVisible,
    		setOverflowVisible: visible => {
    			overflowVisible.set(visible);
    			if (ref) $$invalidate(1, ref.style.overflow = visible ? "visible" : "inherit", ref);
    		}
    	});

    	function section_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('$$scope' in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		size,
    		setContext,
    		writable,
    		ref,
    		overflowVisible
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('ref' in $$props) $$invalidate(1, ref = $$new_props.ref);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, ref, $$restProps, $$scope, slots, section_binding];
    }

    class Toolbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { size: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Toolbar",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get size() {
    		throw new Error("<Toolbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Toolbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Toolbar$1 = Toolbar;

    /* node_modules/carbon-components-svelte/src/DataTable/ToolbarContent.svelte generated by Svelte v3.55.1 */

    const file$m = "node_modules/carbon-components-svelte/src/DataTable/ToolbarContent.svelte";

    function create_fragment$q(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			toggle_class(div, "bx--toolbar-content", true);
    			add_location(div, file$m, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ToolbarContent', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ToolbarContent> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class ToolbarContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToolbarContent",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    var ToolbarContent$1 = ToolbarContent;

    /* node_modules/carbon-components-svelte/src/icons/IconSearch.svelte generated by Svelte v3.55.1 */

    const file$l = "node_modules/carbon-components-svelte/src/icons/IconSearch.svelte";

    // (24:2) {#if title}
    function create_if_block$i(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$l, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$i.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let svg;
    	let path;
    	let if_block = /*title*/ ctx[1] && create_if_block$i(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path = svg_element("path");
    			attr_dev(path, "d", "M29,27.5859l-7.5521-7.5521a11.0177,11.0177,0,1,0-1.4141,1.4141L27.5859,29ZM4,13a9,9,0,1,1,9,9A9.01,9.01,0,0,1,4,13Z");
    			add_location(path, file$l, 24, 2, 579);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$l, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$i(ctx);
    					if_block.c();
    					if_block.m(svg, path);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconSearch', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class IconSearch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconSearch",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get size() {
    		throw new Error("<IconSearch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconSearch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<IconSearch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<IconSearch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var IconSearch$1 = IconSearch;

    /* node_modules/carbon-components-svelte/src/Search/SearchSkeleton.svelte generated by Svelte v3.55.1 */

    const file$k = "node_modules/carbon-components-svelte/src/Search/SearchSkeleton.svelte";

    function create_fragment$o(ctx) {
    	let div1;
    	let span;
    	let t;
    	let div0;
    	let mounted;
    	let dispose;
    	let div1_levels = [/*$$restProps*/ ctx[1]];
    	let div1_data = {};

    	for (let i = 0; i < div1_levels.length; i += 1) {
    		div1_data = assign(div1_data, div1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span = element("span");
    			t = space();
    			div0 = element("div");
    			toggle_class(span, "bx--label", true);
    			add_location(span, file$k, 20, 2, 428);
    			toggle_class(div0, "bx--search-input", true);
    			add_location(div0, file$k, 21, 2, 469);
    			set_attributes(div1, div1_data);
    			toggle_class(div1, "bx--skeleton", true);
    			toggle_class(div1, "bx--search--sm", /*size*/ ctx[0] === 'sm');
    			toggle_class(div1, "bx--search--lg", /*size*/ ctx[0] === 'lg');
    			toggle_class(div1, "bx--search--xl", /*size*/ ctx[0] === 'xl');
    			add_location(div1, file$k, 9, 0, 189);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span);
    			append_dev(div1, t);
    			append_dev(div1, div0);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*click_handler*/ ctx[2], false, false, false),
    					listen_dev(div1, "mouseover", /*mouseover_handler*/ ctx[3], false, false, false),
    					listen_dev(div1, "mouseenter", /*mouseenter_handler*/ ctx[4], false, false, false),
    					listen_dev(div1, "mouseleave", /*mouseleave_handler*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(div1, div1_data = get_spread_update(div1_levels, [dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1]]));
    			toggle_class(div1, "bx--skeleton", true);
    			toggle_class(div1, "bx--search--sm", /*size*/ ctx[0] === 'sm');
    			toggle_class(div1, "bx--search--lg", /*size*/ ctx[0] === 'lg');
    			toggle_class(div1, "bx--search--xl", /*size*/ ctx[0] === 'xl');
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	const omit_props_names = ["size"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchSkeleton', slots, []);
    	let { size = "xl" } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    	};

    	$$self.$capture_state = () => ({ size });

    	$$self.$inject_state = $$new_props => {
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		size,
    		$$restProps,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class SearchSkeleton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { size: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchSkeleton",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get size() {
    		throw new Error("<SearchSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<SearchSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var SearchSkeleton$1 = SearchSkeleton;

    /* node_modules/carbon-components-svelte/src/Search/Search.svelte generated by Svelte v3.55.1 */
    const file$j = "node_modules/carbon-components-svelte/src/Search/Search.svelte";
    const get_labelText_slot_changes$2 = dirty => ({});
    const get_labelText_slot_context$2 = ctx => ({});

    // (91:0) {:else}
    function create_else_block$4(ctx) {
    	let div1;
    	let div0;
    	let switch_instance0;
    	let t0;
    	let label;
    	let label_id_value;
    	let t1;
    	let input;
    	let input_autofocus_value;
    	let t2;
    	let button;
    	let switch_instance1;
    	let div1_aria_labelledby_value;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = /*icon*/ ctx[14];

    	function switch_props(ctx) {
    		return {
    			props: { class: "bx--search-magnifier-icon" },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance0 = construct_svelte_component_dev(switch_value, switch_props());
    	}

    	const labelText_slot_template = /*#slots*/ ctx[20].labelText;
    	const labelText_slot = create_slot(labelText_slot_template, ctx, /*$$scope*/ ctx[19], get_labelText_slot_context$2);
    	const labelText_slot_or_fallback = labelText_slot || fallback_block$7(ctx);

    	let input_levels = [
    		{ type: "text" },
    		{ role: "searchbox" },
    		{
    			autofocus: input_autofocus_value = /*autofocus*/ ctx[11] === true ? true : undefined
    		},
    		{ autocomplete: /*autocomplete*/ ctx[10] },
    		{ disabled: /*disabled*/ ctx[7] },
    		{ id: /*id*/ ctx[15] },
    		{ placeholder: /*placeholder*/ ctx[9] },
    		/*$$restProps*/ ctx[18]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	var switch_value_1 = Close$1;

    	function switch_props_1(ctx) {
    		return {
    			props: { size: /*size*/ ctx[3] === 'xl' ? 20 : 16 },
    			$$inline: true
    		};
    	}

    	if (switch_value_1) {
    		switch_instance1 = construct_svelte_component_dev(switch_value_1, switch_props_1(ctx));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (switch_instance0) create_component(switch_instance0.$$.fragment);
    			t0 = space();
    			label = element("label");
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.c();
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			button = element("button");
    			if (switch_instance1) create_component(switch_instance1.$$.fragment);
    			toggle_class(div0, "bx--search-magnifier", true);
    			add_location(div0, file$j, 105, 4, 2656);
    			attr_dev(label, "id", label_id_value = "" + (/*id*/ ctx[15] + "-search"));
    			attr_dev(label, "for", /*id*/ ctx[15]);
    			toggle_class(label, "bx--label", true);
    			add_location(label, file$j, 114, 4, 2905);
    			set_attributes(input, input_data);
    			toggle_class(input, "bx--search-input", true);
    			add_location(input, file$j, 120, 4, 3089);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "aria-label", /*closeButtonLabelText*/ ctx[12]);
    			button.disabled = /*disabled*/ ctx[7];
    			toggle_class(button, "bx--search-close", true);
    			toggle_class(button, "bx--search-close--hidden", /*value*/ ctx[2] === '');
    			add_location(button, file$j, 154, 4, 3867);
    			attr_dev(div1, "role", "search");
    			attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value = "" + (/*id*/ ctx[15] + "-search"));
    			attr_dev(div1, "class", /*searchClass*/ ctx[4]);
    			toggle_class(div1, "bx--search", true);
    			toggle_class(div1, "bx--search--light", /*light*/ ctx[6]);
    			toggle_class(div1, "bx--search--disabled", /*disabled*/ ctx[7]);
    			toggle_class(div1, "bx--search--sm", /*size*/ ctx[3] === 'sm');
    			toggle_class(div1, "bx--search--lg", /*size*/ ctx[3] === 'lg');
    			toggle_class(div1, "bx--search--xl", /*size*/ ctx[3] === 'xl');
    			toggle_class(div1, "bx--search--expandable", /*expandable*/ ctx[8]);
    			toggle_class(div1, "bx--search--expanded", /*expanded*/ ctx[0]);
    			add_location(div1, file$j, 91, 2, 2171);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (switch_instance0) mount_component(switch_instance0, div0, null);
    			/*div0_binding*/ ctx[33](div0);
    			append_dev(div1, t0);
    			append_dev(div1, label);

    			if (labelText_slot_or_fallback) {
    				labelText_slot_or_fallback.m(label, null);
    			}

    			append_dev(div1, t1);
    			append_dev(div1, input);
    			if (input.autofocus) input.focus();
    			/*input_binding*/ ctx[35](input);
    			set_input_value(input, /*value*/ ctx[2]);
    			append_dev(div1, t2);
    			append_dev(div1, button);
    			if (switch_instance1) mount_component(switch_instance1, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler_2*/ ctx[34], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[36]),
    					listen_dev(input, "change", /*change_handler*/ ctx[22], false, false, false),
    					listen_dev(input, "input", /*input_handler*/ ctx[23], false, false, false),
    					listen_dev(input, "focus", /*focus_handler*/ ctx[24], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_1*/ ctx[37], false, false, false),
    					listen_dev(input, "blur", /*blur_handler*/ ctx[25], false, false, false),
    					listen_dev(input, "blur", /*blur_handler_1*/ ctx[38], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler*/ ctx[26], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_1*/ ctx[39], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler*/ ctx[27], false, false, false),
    					listen_dev(input, "paste", /*paste_handler*/ ctx[28], false, false, false),
    					listen_dev(button, "click", /*click_handler_1*/ ctx[21], false, false, false),
    					listen_dev(button, "click", /*click_handler_3*/ ctx[40], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*icon*/ ctx[14])) {
    				if (switch_instance0) {
    					group_outros();
    					const old_component = switch_instance0;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance0 = construct_svelte_component_dev(switch_value, switch_props());
    					create_component(switch_instance0.$$.fragment);
    					transition_in(switch_instance0.$$.fragment, 1);
    					mount_component(switch_instance0, div0, null);
    				} else {
    					switch_instance0 = null;
    				}
    			}

    			if (labelText_slot) {
    				if (labelText_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						labelText_slot,
    						labelText_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(labelText_slot_template, /*$$scope*/ ctx[19], dirty, get_labelText_slot_changes$2),
    						get_labelText_slot_context$2
    					);
    				}
    			} else {
    				if (labelText_slot_or_fallback && labelText_slot_or_fallback.p && (!current || dirty[0] & /*labelText*/ 8192)) {
    					labelText_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*id*/ 32768 && label_id_value !== (label_id_value = "" + (/*id*/ ctx[15] + "-search"))) {
    				attr_dev(label, "id", label_id_value);
    			}

    			if (!current || dirty[0] & /*id*/ 32768) {
    				attr_dev(label, "for", /*id*/ ctx[15]);
    			}

    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				{ type: "text" },
    				{ role: "searchbox" },
    				(!current || dirty[0] & /*autofocus*/ 2048 && input_autofocus_value !== (input_autofocus_value = /*autofocus*/ ctx[11] === true ? true : undefined)) && { autofocus: input_autofocus_value },
    				(!current || dirty[0] & /*autocomplete*/ 1024) && { autocomplete: /*autocomplete*/ ctx[10] },
    				(!current || dirty[0] & /*disabled*/ 128) && { disabled: /*disabled*/ ctx[7] },
    				(!current || dirty[0] & /*id*/ 32768) && { id: /*id*/ ctx[15] },
    				(!current || dirty[0] & /*placeholder*/ 512) && { placeholder: /*placeholder*/ ctx[9] },
    				dirty[0] & /*$$restProps*/ 262144 && /*$$restProps*/ ctx[18]
    			]));

    			if (dirty[0] & /*value*/ 4 && input.value !== /*value*/ ctx[2]) {
    				set_input_value(input, /*value*/ ctx[2]);
    			}

    			toggle_class(input, "bx--search-input", true);
    			const switch_instance1_changes = {};
    			if (dirty[0] & /*size*/ 8) switch_instance1_changes.size = /*size*/ ctx[3] === 'xl' ? 20 : 16;

    			if (switch_value_1 !== (switch_value_1 = Close$1)) {
    				if (switch_instance1) {
    					group_outros();
    					const old_component = switch_instance1;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value_1) {
    					switch_instance1 = construct_svelte_component_dev(switch_value_1, switch_props_1(ctx));
    					create_component(switch_instance1.$$.fragment);
    					transition_in(switch_instance1.$$.fragment, 1);
    					mount_component(switch_instance1, button, null);
    				} else {
    					switch_instance1 = null;
    				}
    			} else if (switch_value_1) {
    				switch_instance1.$set(switch_instance1_changes);
    			}

    			if (!current || dirty[0] & /*closeButtonLabelText*/ 4096) {
    				attr_dev(button, "aria-label", /*closeButtonLabelText*/ ctx[12]);
    			}

    			if (!current || dirty[0] & /*disabled*/ 128) {
    				prop_dev(button, "disabled", /*disabled*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*value*/ 4) {
    				toggle_class(button, "bx--search-close--hidden", /*value*/ ctx[2] === '');
    			}

    			if (!current || dirty[0] & /*id*/ 32768 && div1_aria_labelledby_value !== (div1_aria_labelledby_value = "" + (/*id*/ ctx[15] + "-search"))) {
    				attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value);
    			}

    			if (!current || dirty[0] & /*searchClass*/ 16) {
    				attr_dev(div1, "class", /*searchClass*/ ctx[4]);
    			}

    			if (!current || dirty[0] & /*searchClass*/ 16) {
    				toggle_class(div1, "bx--search", true);
    			}

    			if (!current || dirty[0] & /*searchClass, light*/ 80) {
    				toggle_class(div1, "bx--search--light", /*light*/ ctx[6]);
    			}

    			if (!current || dirty[0] & /*searchClass, disabled*/ 144) {
    				toggle_class(div1, "bx--search--disabled", /*disabled*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*searchClass, size*/ 24) {
    				toggle_class(div1, "bx--search--sm", /*size*/ ctx[3] === 'sm');
    			}

    			if (!current || dirty[0] & /*searchClass, size*/ 24) {
    				toggle_class(div1, "bx--search--lg", /*size*/ ctx[3] === 'lg');
    			}

    			if (!current || dirty[0] & /*searchClass, size*/ 24) {
    				toggle_class(div1, "bx--search--xl", /*size*/ ctx[3] === 'xl');
    			}

    			if (!current || dirty[0] & /*searchClass, expandable*/ 272) {
    				toggle_class(div1, "bx--search--expandable", /*expandable*/ ctx[8]);
    			}

    			if (!current || dirty[0] & /*searchClass, expanded*/ 17) {
    				toggle_class(div1, "bx--search--expanded", /*expanded*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance0) transition_in(switch_instance0.$$.fragment, local);
    			transition_in(labelText_slot_or_fallback, local);
    			if (switch_instance1) transition_in(switch_instance1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance0) transition_out(switch_instance0.$$.fragment, local);
    			transition_out(labelText_slot_or_fallback, local);
    			if (switch_instance1) transition_out(switch_instance1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (switch_instance0) destroy_component(switch_instance0);
    			/*div0_binding*/ ctx[33](null);
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.d(detaching);
    			/*input_binding*/ ctx[35](null);
    			if (switch_instance1) destroy_component(switch_instance1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(91:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (82:0) {#if skeleton}
    function create_if_block$h(ctx) {
    	let searchskeleton;
    	let current;
    	const searchskeleton_spread_levels = [{ size: /*size*/ ctx[3] }, /*$$restProps*/ ctx[18]];
    	let searchskeleton_props = {};

    	for (let i = 0; i < searchskeleton_spread_levels.length; i += 1) {
    		searchskeleton_props = assign(searchskeleton_props, searchskeleton_spread_levels[i]);
    	}

    	searchskeleton = new SearchSkeleton$1({
    			props: searchskeleton_props,
    			$$inline: true
    		});

    	searchskeleton.$on("click", /*click_handler*/ ctx[29]);
    	searchskeleton.$on("mouseover", /*mouseover_handler*/ ctx[30]);
    	searchskeleton.$on("mouseenter", /*mouseenter_handler*/ ctx[31]);
    	searchskeleton.$on("mouseleave", /*mouseleave_handler*/ ctx[32]);

    	const block = {
    		c: function create() {
    			create_component(searchskeleton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(searchskeleton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const searchskeleton_changes = (dirty[0] & /*size, $$restProps*/ 262152)
    			? get_spread_update(searchskeleton_spread_levels, [
    					dirty[0] & /*size*/ 8 && { size: /*size*/ ctx[3] },
    					dirty[0] & /*$$restProps*/ 262144 && get_spread_object(/*$$restProps*/ ctx[18])
    				])
    			: {};

    			searchskeleton.$set(searchskeleton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchskeleton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchskeleton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(searchskeleton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$h.name,
    		type: "if",
    		source: "(82:0) {#if skeleton}",
    		ctx
    	});

    	return block;
    }

    // (116:29)
    function fallback_block$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*labelText*/ ctx[13]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*labelText*/ 8192) set_data_dev(t, /*labelText*/ ctx[13]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$7.name,
    		type: "fallback",
    		source: "(116:29)          ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$h, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*skeleton*/ ctx[5]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"value","size","searchClass","skeleton","light","disabled","expandable","expanded","placeholder","autocomplete","autofocus","closeButtonLabelText","labelText","icon","id","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Search', slots, ['labelText']);
    	let { value = "" } = $$props;
    	let { size = "xl" } = $$props;
    	let { searchClass = "" } = $$props;
    	let { skeleton = false } = $$props;
    	let { light = false } = $$props;
    	let { disabled = false } = $$props;
    	let { expandable = false } = $$props;
    	let { expanded = false } = $$props;
    	let { placeholder = "Search..." } = $$props;
    	let { autocomplete = "off" } = $$props;
    	let { autofocus = false } = $$props;
    	let { closeButtonLabelText = "Clear search input" } = $$props;
    	let { labelText = "" } = $$props;
    	let { icon = IconSearch$1 } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { ref = null } = $$props;
    	const dispatch = createEventDispatcher();
    	let searchRef = null;

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function paste_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			searchRef = $$value;
    			$$invalidate(16, searchRef);
    		});
    	}

    	const click_handler_2 = () => {
    		if (expandable) $$invalidate(0, expanded = true);
    	};

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(2, value);
    	}

    	const focus_handler_1 = () => {
    		if (expandable) $$invalidate(0, expanded = true);
    	};

    	const blur_handler_1 = () => {
    		if (expanded && value.trim().length === 0) {
    			$$invalidate(0, expanded = false);
    		}
    	};

    	const keydown_handler_1 = ({ key }) => {
    		if (key === 'Escape') {
    			$$invalidate(2, value = '');
    			dispatch('clear');
    		}
    	};

    	const click_handler_3 = () => {
    		$$invalidate(2, value = '');
    		ref.focus();
    		dispatch('clear');
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(18, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('value' in $$new_props) $$invalidate(2, value = $$new_props.value);
    		if ('size' in $$new_props) $$invalidate(3, size = $$new_props.size);
    		if ('searchClass' in $$new_props) $$invalidate(4, searchClass = $$new_props.searchClass);
    		if ('skeleton' in $$new_props) $$invalidate(5, skeleton = $$new_props.skeleton);
    		if ('light' in $$new_props) $$invalidate(6, light = $$new_props.light);
    		if ('disabled' in $$new_props) $$invalidate(7, disabled = $$new_props.disabled);
    		if ('expandable' in $$new_props) $$invalidate(8, expandable = $$new_props.expandable);
    		if ('expanded' in $$new_props) $$invalidate(0, expanded = $$new_props.expanded);
    		if ('placeholder' in $$new_props) $$invalidate(9, placeholder = $$new_props.placeholder);
    		if ('autocomplete' in $$new_props) $$invalidate(10, autocomplete = $$new_props.autocomplete);
    		if ('autofocus' in $$new_props) $$invalidate(11, autofocus = $$new_props.autofocus);
    		if ('closeButtonLabelText' in $$new_props) $$invalidate(12, closeButtonLabelText = $$new_props.closeButtonLabelText);
    		if ('labelText' in $$new_props) $$invalidate(13, labelText = $$new_props.labelText);
    		if ('icon' in $$new_props) $$invalidate(14, icon = $$new_props.icon);
    		if ('id' in $$new_props) $$invalidate(15, id = $$new_props.id);
    		if ('ref' in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    		if ('$$scope' in $$new_props) $$invalidate(19, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		value,
    		size,
    		searchClass,
    		skeleton,
    		light,
    		disabled,
    		expandable,
    		expanded,
    		placeholder,
    		autocomplete,
    		autofocus,
    		closeButtonLabelText,
    		labelText,
    		icon,
    		id,
    		ref,
    		createEventDispatcher,
    		Close: Close$1,
    		IconSearch: IconSearch$1,
    		SearchSkeleton: SearchSkeleton$1,
    		dispatch,
    		searchRef
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('value' in $$props) $$invalidate(2, value = $$new_props.value);
    		if ('size' in $$props) $$invalidate(3, size = $$new_props.size);
    		if ('searchClass' in $$props) $$invalidate(4, searchClass = $$new_props.searchClass);
    		if ('skeleton' in $$props) $$invalidate(5, skeleton = $$new_props.skeleton);
    		if ('light' in $$props) $$invalidate(6, light = $$new_props.light);
    		if ('disabled' in $$props) $$invalidate(7, disabled = $$new_props.disabled);
    		if ('expandable' in $$props) $$invalidate(8, expandable = $$new_props.expandable);
    		if ('expanded' in $$props) $$invalidate(0, expanded = $$new_props.expanded);
    		if ('placeholder' in $$props) $$invalidate(9, placeholder = $$new_props.placeholder);
    		if ('autocomplete' in $$props) $$invalidate(10, autocomplete = $$new_props.autocomplete);
    		if ('autofocus' in $$props) $$invalidate(11, autofocus = $$new_props.autofocus);
    		if ('closeButtonLabelText' in $$props) $$invalidate(12, closeButtonLabelText = $$new_props.closeButtonLabelText);
    		if ('labelText' in $$props) $$invalidate(13, labelText = $$new_props.labelText);
    		if ('icon' in $$props) $$invalidate(14, icon = $$new_props.icon);
    		if ('id' in $$props) $$invalidate(15, id = $$new_props.id);
    		if ('ref' in $$props) $$invalidate(1, ref = $$new_props.ref);
    		if ('searchRef' in $$props) $$invalidate(16, searchRef = $$new_props.searchRef);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*expanded, ref*/ 3) {
    			if (expanded && ref) ref.focus();
    		}

    		if ($$self.$$.dirty[0] & /*expanded*/ 1) {
    			dispatch(expanded ? "expand" : "collapse");
    		}
    	};

    	return [
    		expanded,
    		ref,
    		value,
    		size,
    		searchClass,
    		skeleton,
    		light,
    		disabled,
    		expandable,
    		placeholder,
    		autocomplete,
    		autofocus,
    		closeButtonLabelText,
    		labelText,
    		icon,
    		id,
    		searchRef,
    		dispatch,
    		$$restProps,
    		$$scope,
    		slots,
    		click_handler_1,
    		change_handler,
    		input_handler,
    		focus_handler,
    		blur_handler,
    		keydown_handler,
    		keyup_handler,
    		paste_handler,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		div0_binding,
    		click_handler_2,
    		input_binding,
    		input_input_handler,
    		focus_handler_1,
    		blur_handler_1,
    		keydown_handler_1,
    		click_handler_3
    	];
    }

    class Search extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$n,
    			create_fragment$n,
    			safe_not_equal,
    			{
    				value: 2,
    				size: 3,
    				searchClass: 4,
    				skeleton: 5,
    				light: 6,
    				disabled: 7,
    				expandable: 8,
    				expanded: 0,
    				placeholder: 9,
    				autocomplete: 10,
    				autofocus: 11,
    				closeButtonLabelText: 12,
    				labelText: 13,
    				icon: 14,
    				id: 15,
    				ref: 1
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get value() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get searchClass() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchClass(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skeleton() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skeleton(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expandable() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expandable(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expanded() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expanded(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autocomplete() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autocomplete(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autofocus() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autofocus(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeButtonLabelText() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeButtonLabelText(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelText() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelText(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Search$1 = Search;

    /* node_modules/carbon-components-svelte/src/DataTable/ToolbarSearch.svelte generated by Svelte v3.55.1 */

    function create_fragment$m(ctx) {
    	let search;
    	let updating_ref;
    	let updating_value;
    	let current;

    	const search_spread_levels = [
    		{ tabindex: /*tabindex*/ ctx[5] },
    		{ disabled: /*disabled*/ ctx[4] },
    		/*$$restProps*/ ctx[9],
    		{
    			searchClass: "" + (/*classes*/ ctx[6] + " " + /*$$restProps*/ ctx[9].class)
    		}
    	];

    	function search_ref_binding(value) {
    		/*search_ref_binding*/ ctx[14](value);
    	}

    	function search_value_binding(value) {
    		/*search_value_binding*/ ctx[15](value);
    	}

    	let search_props = {};

    	for (let i = 0; i < search_spread_levels.length; i += 1) {
    		search_props = assign(search_props, search_spread_levels[i]);
    	}

    	if (/*ref*/ ctx[2] !== void 0) {
    		search_props.ref = /*ref*/ ctx[2];
    	}

    	if (/*value*/ ctx[0] !== void 0) {
    		search_props.value = /*value*/ ctx[0];
    	}

    	search = new Search$1({ props: search_props, $$inline: true });
    	binding_callbacks.push(() => bind(search, 'ref', search_ref_binding));
    	binding_callbacks.push(() => bind(search, 'value', search_value_binding));
    	search.$on("clear", /*clear_handler*/ ctx[16]);
    	search.$on("clear", /*expandSearch*/ ctx[8]);
    	search.$on("change", /*change_handler*/ ctx[17]);
    	search.$on("input", /*input_handler*/ ctx[18]);
    	search.$on("focus", /*focus_handler*/ ctx[19]);
    	search.$on("focus", /*expandSearch*/ ctx[8]);
    	search.$on("blur", /*blur_handler*/ ctx[20]);
    	search.$on("blur", /*blur_handler_1*/ ctx[21]);
    	search.$on("keyup", /*keyup_handler*/ ctx[22]);
    	search.$on("keydown", /*keydown_handler*/ ctx[23]);
    	search.$on("paste", /*paste_handler*/ ctx[24]);

    	const block = {
    		c: function create() {
    			create_component(search.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(search, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const search_changes = (dirty & /*tabindex, disabled, $$restProps, classes*/ 624)
    			? get_spread_update(search_spread_levels, [
    					dirty & /*tabindex*/ 32 && { tabindex: /*tabindex*/ ctx[5] },
    					dirty & /*disabled*/ 16 && { disabled: /*disabled*/ ctx[4] },
    					dirty & /*$$restProps*/ 512 && get_spread_object(/*$$restProps*/ ctx[9]),
    					dirty & /*classes, $$restProps*/ 576 && {
    						searchClass: "" + (/*classes*/ ctx[6] + " " + /*$$restProps*/ ctx[9].class)
    					}
    				])
    			: {};

    			if (!updating_ref && dirty & /*ref*/ 4) {
    				updating_ref = true;
    				search_changes.ref = /*ref*/ ctx[2];
    				add_flush_callback(() => updating_ref = false);
    			}

    			if (!updating_value && dirty & /*value*/ 1) {
    				updating_value = true;
    				search_changes.value = /*value*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			search.$set(search_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(search.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(search.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(search, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let originalRows;
    	let classes;

    	const omit_props_names = [
    		"value","expanded","persistent","disabled","shouldFilterRows","filteredRowIds","tabindex","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $tableRows;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ToolbarSearch', slots, []);
    	let { value = "" } = $$props;
    	let { expanded = false } = $$props;
    	let { persistent = false } = $$props;
    	let { disabled = false } = $$props;
    	let { shouldFilterRows = false } = $$props;
    	let { filteredRowIds = [] } = $$props;
    	let { tabindex = "0" } = $$props;
    	let { ref = null } = $$props;
    	const { tableRows } = getContext("DataTable") ?? {};
    	validate_store(tableRows, 'tableRows');
    	component_subscribe($$self, tableRows, value => $$invalidate(13, $tableRows = value));

    	async function expandSearch() {
    		await tick();
    		if (disabled || persistent || expanded) return;
    		$$invalidate(1, expanded = true);
    		await tick();
    		ref.focus();
    	}

    	function search_ref_binding(value) {
    		ref = value;
    		$$invalidate(2, ref);
    	}

    	function search_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(0, value);
    	}

    	function clear_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const blur_handler_1 = () => {
    		$$invalidate(1, expanded = !persistent && !!value.length);
    	};

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function paste_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('expanded' in $$new_props) $$invalidate(1, expanded = $$new_props.expanded);
    		if ('persistent' in $$new_props) $$invalidate(3, persistent = $$new_props.persistent);
    		if ('disabled' in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ('shouldFilterRows' in $$new_props) $$invalidate(11, shouldFilterRows = $$new_props.shouldFilterRows);
    		if ('filteredRowIds' in $$new_props) $$invalidate(10, filteredRowIds = $$new_props.filteredRowIds);
    		if ('tabindex' in $$new_props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ('ref' in $$new_props) $$invalidate(2, ref = $$new_props.ref);
    	};

    	$$self.$capture_state = () => ({
    		value,
    		expanded,
    		persistent,
    		disabled,
    		shouldFilterRows,
    		filteredRowIds,
    		tabindex,
    		ref,
    		tick,
    		getContext,
    		Search: Search$1,
    		tableRows,
    		expandSearch,
    		classes,
    		originalRows,
    		$tableRows
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('expanded' in $$props) $$invalidate(1, expanded = $$new_props.expanded);
    		if ('persistent' in $$props) $$invalidate(3, persistent = $$new_props.persistent);
    		if ('disabled' in $$props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ('shouldFilterRows' in $$props) $$invalidate(11, shouldFilterRows = $$new_props.shouldFilterRows);
    		if ('filteredRowIds' in $$props) $$invalidate(10, filteredRowIds = $$new_props.filteredRowIds);
    		if ('tabindex' in $$props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ('ref' in $$props) $$invalidate(2, ref = $$new_props.ref);
    		if ('classes' in $$props) $$invalidate(6, classes = $$new_props.classes);
    		if ('originalRows' in $$props) $$invalidate(12, originalRows = $$new_props.originalRows);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$tableRows*/ 8192) {
    			$$invalidate(12, originalRows = tableRows ? [...$tableRows] : []);
    		}

    		if ($$self.$$.dirty & /*shouldFilterRows, originalRows, value*/ 6145) {
    			if (shouldFilterRows) {
    				let rows = originalRows;

    				if (value.trim().length > 0) {
    					if (shouldFilterRows === true) {
    						rows = rows.filter(row => {
    							return Object.entries(row).filter(([key]) => key !== "id").some(([key, _value]) => {
    								if (typeof _value === "string" || typeof _value === "number") {
    									return (_value + "")?.toLowerCase().includes(value.trim().toLowerCase());
    								}
    							});
    						});
    					} else if (typeof shouldFilterRows === "function") {
    						rows = rows.filter(row => shouldFilterRows(row, value) ?? false);
    					}
    				}

    				tableRows.set(rows);
    				$$invalidate(10, filteredRowIds = rows.map(row => row.id));
    			}
    		}

    		if ($$self.$$.dirty & /*value*/ 1) {
    			$$invalidate(1, expanded = !!value.length);
    		}

    		if ($$self.$$.dirty & /*expanded, persistent, disabled*/ 26) {
    			$$invalidate(6, classes = [
    				expanded && "bx--toolbar-search-container-active",
    				persistent
    				? "bx--toolbar-search-container-persistent"
    				: "bx--toolbar-search-container-expandable",
    				disabled && "bx--toolbar-search-container-disabled"
    			].filter(Boolean).join(" "));
    		}
    	};

    	return [
    		value,
    		expanded,
    		ref,
    		persistent,
    		disabled,
    		tabindex,
    		classes,
    		tableRows,
    		expandSearch,
    		$$restProps,
    		filteredRowIds,
    		shouldFilterRows,
    		originalRows,
    		$tableRows,
    		search_ref_binding,
    		search_value_binding,
    		clear_handler,
    		change_handler,
    		input_handler,
    		focus_handler,
    		blur_handler,
    		blur_handler_1,
    		keyup_handler,
    		keydown_handler,
    		paste_handler
    	];
    }

    class ToolbarSearch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
    			value: 0,
    			expanded: 1,
    			persistent: 3,
    			disabled: 4,
    			shouldFilterRows: 11,
    			filteredRowIds: 10,
    			tabindex: 5,
    			ref: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToolbarSearch",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get value() {
    		throw new Error("<ToolbarSearch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ToolbarSearch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expanded() {
    		throw new Error("<ToolbarSearch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expanded(value) {
    		throw new Error("<ToolbarSearch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get persistent() {
    		throw new Error("<ToolbarSearch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set persistent(value) {
    		throw new Error("<ToolbarSearch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<ToolbarSearch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<ToolbarSearch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shouldFilterRows() {
    		throw new Error("<ToolbarSearch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shouldFilterRows(value) {
    		throw new Error("<ToolbarSearch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filteredRowIds() {
    		throw new Error("<ToolbarSearch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filteredRowIds(value) {
    		throw new Error("<ToolbarSearch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<ToolbarSearch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<ToolbarSearch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<ToolbarSearch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<ToolbarSearch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ToolbarSearch$1 = ToolbarSearch;

    /* node_modules/carbon-components-svelte/src/icons/Settings.svelte generated by Svelte v3.55.1 */

    const file$i = "node_modules/carbon-components-svelte/src/icons/Settings.svelte";

    // (24:2) {#if title}
    function create_if_block$g(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$i, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let if_block = /*title*/ ctx[1] && create_if_block$g(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M27,16.76c0-.25,0-.5,0-.76s0-.51,0-.77l1.92-1.68A2,2,0,0,0,29.3,11L26.94,7a2,2,0,0,0-1.73-1,2,2,0,0,0-.64.1l-2.43.82a11.35,11.35,0,0,0-1.31-.75l-.51-2.52a2,2,0,0,0-2-1.61H13.64a2,2,0,0,0-2,1.61l-.51,2.52a11.48,11.48,0,0,0-1.32.75L7.43,6.06A2,2,0,0,0,6.79,6,2,2,0,0,0,5.06,7L2.7,11a2,2,0,0,0,.41,2.51L5,15.24c0,.25,0,.5,0,.76s0,.51,0,.77L3.11,18.45A2,2,0,0,0,2.7,21L5.06,25a2,2,0,0,0,1.73,1,2,2,0,0,0,.64-.1l2.43-.82a11.35,11.35,0,0,0,1.31.75l.51,2.52a2,2,0,0,0,2,1.61h4.72a2,2,0,0,0,2-1.61l.51-2.52a11.48,11.48,0,0,0,1.32-.75l2.42.82a2,2,0,0,0,.64.1,2,2,0,0,0,1.73-1L29.3,21a2,2,0,0,0-.41-2.51ZM25.21,24l-3.43-1.16a8.86,8.86,0,0,1-2.71,1.57L18.36,28H13.64l-.71-3.55a9.36,9.36,0,0,1-2.7-1.57L6.79,24,4.43,20l2.72-2.4a8.9,8.9,0,0,1,0-3.13L4.43,12,6.79,8l3.43,1.16a8.86,8.86,0,0,1,2.71-1.57L13.64,4h4.72l.71,3.55a9.36,9.36,0,0,1,2.7,1.57L25.21,8,27.57,12l-2.72,2.4a8.9,8.9,0,0,1,0,3.13L27.57,20Z");
    			add_location(path0, file$i, 24, 2, 579);
    			attr_dev(path1, "d", "M16,22a6,6,0,1,1,6-6A5.94,5.94,0,0,1,16,22Zm0-10a3.91,3.91,0,0,0-4,4,3.91,3.91,0,0,0,4,4,3.91,3.91,0,0,0,4-4A3.91,3.91,0,0,0,16,12Z");
    			add_location(path1, file$i, 26, 10, 1496);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$i, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$g(ctx);
    					if_block.c();
    					if_block.m(svg, path0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Settings', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class Settings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Settings",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get size() {
    		throw new Error("<Settings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Settings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Settings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Settings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Settings$1 = Settings;

    /* node_modules/carbon-components-svelte/src/icons/OverflowMenuVertical.svelte generated by Svelte v3.55.1 */

    const file$h = "node_modules/carbon-components-svelte/src/icons/OverflowMenuVertical.svelte";

    // (24:2) {#if title}
    function create_if_block$f(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$h, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let svg;
    	let circle0;
    	let circle1;
    	let circle2;
    	let if_block = /*title*/ ctx[1] && create_if_block$f(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			circle0 = svg_element("circle");
    			circle1 = svg_element("circle");
    			circle2 = svg_element("circle");
    			attr_dev(circle0, "cx", "16");
    			attr_dev(circle0, "cy", "8");
    			attr_dev(circle0, "r", "2");
    			add_location(circle0, file$h, 24, 2, 579);
    			attr_dev(circle1, "cx", "16");
    			attr_dev(circle1, "cy", "16");
    			attr_dev(circle1, "r", "2");
    			add_location(circle1, file$h, 24, 40, 617);
    			attr_dev(circle2, "cx", "16");
    			attr_dev(circle2, "cy", "24");
    			attr_dev(circle2, "r", "2");
    			add_location(circle2, file$h, 25, 12, 659);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$h, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, circle0);
    			append_dev(svg, circle1);
    			append_dev(svg, circle2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$f(ctx);
    					if_block.c();
    					if_block.m(svg, circle0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OverflowMenuVertical', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class OverflowMenuVertical extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OverflowMenuVertical",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get size() {
    		throw new Error("<OverflowMenuVertical>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<OverflowMenuVertical>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<OverflowMenuVertical>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<OverflowMenuVertical>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var OverflowMenuVertical$1 = OverflowMenuVertical;

    /* node_modules/carbon-components-svelte/src/icons/OverflowMenuHorizontal.svelte generated by Svelte v3.55.1 */

    const file$g = "node_modules/carbon-components-svelte/src/icons/OverflowMenuHorizontal.svelte";

    // (24:2) {#if title}
    function create_if_block$e(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$g, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let svg;
    	let circle0;
    	let circle1;
    	let circle2;
    	let if_block = /*title*/ ctx[1] && create_if_block$e(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			circle0 = svg_element("circle");
    			circle1 = svg_element("circle");
    			circle2 = svg_element("circle");
    			attr_dev(circle0, "cx", "8");
    			attr_dev(circle0, "cy", "16");
    			attr_dev(circle0, "r", "2");
    			add_location(circle0, file$g, 24, 2, 579);
    			attr_dev(circle1, "cx", "16");
    			attr_dev(circle1, "cy", "16");
    			attr_dev(circle1, "r", "2");
    			add_location(circle1, file$g, 24, 40, 617);
    			attr_dev(circle2, "cx", "24");
    			attr_dev(circle2, "cy", "16");
    			attr_dev(circle2, "r", "2");
    			add_location(circle2, file$g, 25, 12, 659);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$g, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, circle0);
    			append_dev(svg, circle1);
    			append_dev(svg, circle2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$e(ctx);
    					if_block.c();
    					if_block.m(svg, circle0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OverflowMenuHorizontal', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class OverflowMenuHorizontal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OverflowMenuHorizontal",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get size() {
    		throw new Error("<OverflowMenuHorizontal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<OverflowMenuHorizontal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<OverflowMenuHorizontal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<OverflowMenuHorizontal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var OverflowMenuHorizontal$1 = OverflowMenuHorizontal;

    /* node_modules/carbon-components-svelte/src/OverflowMenu/OverflowMenu.svelte generated by Svelte v3.55.1 */
    const file$f = "node_modules/carbon-components-svelte/src/OverflowMenu/OverflowMenu.svelte";
    const get_menu_slot_changes = dirty => ({});
    const get_menu_slot_context = ctx => ({});

    // (236:20)
    function fallback_block$6(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*icon*/ ctx[1];

    	function switch_props(ctx) {
    		return {
    			props: {
    				"aria-label": /*iconDescription*/ ctx[10],
    				title: /*iconDescription*/ ctx[10],
    				class: "bx--overflow-menu__icon " + /*iconClass*/ ctx[9]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty[0] & /*iconDescription*/ 1024) switch_instance_changes["aria-label"] = /*iconDescription*/ ctx[10];
    			if (dirty[0] & /*iconDescription*/ 1024) switch_instance_changes.title = /*iconDescription*/ ctx[10];
    			if (dirty[0] & /*iconClass*/ 512) switch_instance_changes.class = "bx--overflow-menu__icon " + /*iconClass*/ ctx[9];

    			if (switch_value !== (switch_value = /*icon*/ ctx[1])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$6.name,
    		type: "fallback",
    		source: "(236:20)      ",
    		ctx
    	});

    	return block;
    }

    // (244:2) {#if open}
    function create_if_block$d(ctx) {
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[24].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[23], null);

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			attr_dev(ul, "role", "menu");
    			attr_dev(ul, "tabindex", "-1");
    			attr_dev(ul, "aria-label", /*ariaLabel*/ ctx[13]);
    			attr_dev(ul, "data-floating-menu-direction", /*direction*/ ctx[5]);
    			attr_dev(ul, "class", /*menuOptionsClass*/ ctx[8]);
    			toggle_class(ul, "bx--overflow-menu-options", true);
    			toggle_class(ul, "bx--overflow-menu--flip", /*flipped*/ ctx[7]);
    			toggle_class(ul, "bx--overflow-menu-options--open", /*open*/ ctx[0]);
    			toggle_class(ul, "bx--overflow-menu-options--light", /*light*/ ctx[6]);
    			toggle_class(ul, "bx--overflow-menu-options--sm", /*size*/ ctx[4] === 'sm');
    			toggle_class(ul, "bx--overflow-menu-options--xl", /*size*/ ctx[4] === 'xl');
    			toggle_class(ul, "bx--breadcrumb-menu-options", !!/*ctxBreadcrumbItem*/ ctx[14]);
    			add_location(ul, file$f, 244, 4, 5817);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			/*ul_binding*/ ctx[31](ul);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 8388608)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[23],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[23])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[23], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty[0] & /*ariaLabel*/ 8192) {
    				attr_dev(ul, "aria-label", /*ariaLabel*/ ctx[13]);
    			}

    			if (!current || dirty[0] & /*direction*/ 32) {
    				attr_dev(ul, "data-floating-menu-direction", /*direction*/ ctx[5]);
    			}

    			if (!current || dirty[0] & /*menuOptionsClass*/ 256) {
    				attr_dev(ul, "class", /*menuOptionsClass*/ ctx[8]);
    			}

    			if (!current || dirty[0] & /*menuOptionsClass*/ 256) {
    				toggle_class(ul, "bx--overflow-menu-options", true);
    			}

    			if (!current || dirty[0] & /*menuOptionsClass, flipped*/ 384) {
    				toggle_class(ul, "bx--overflow-menu--flip", /*flipped*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*menuOptionsClass, open*/ 257) {
    				toggle_class(ul, "bx--overflow-menu-options--open", /*open*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*menuOptionsClass, light*/ 320) {
    				toggle_class(ul, "bx--overflow-menu-options--light", /*light*/ ctx[6]);
    			}

    			if (!current || dirty[0] & /*menuOptionsClass, size*/ 272) {
    				toggle_class(ul, "bx--overflow-menu-options--sm", /*size*/ ctx[4] === 'sm');
    			}

    			if (!current || dirty[0] & /*menuOptionsClass, size*/ 272) {
    				toggle_class(ul, "bx--overflow-menu-options--xl", /*size*/ ctx[4] === 'xl');
    			}

    			if (!current || dirty[0] & /*menuOptionsClass, ctxBreadcrumbItem*/ 16640) {
    				toggle_class(ul, "bx--breadcrumb-menu-options", !!/*ctxBreadcrumbItem*/ ctx[14]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (default_slot) default_slot.d(detaching);
    			/*ul_binding*/ ctx[31](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(244:2) {#if open}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let html_tag;
    	let html_anchor;
    	let t0;
    	let button;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	const menu_slot_template = /*#slots*/ ctx[24].menu;
    	const menu_slot = create_slot(menu_slot_template, ctx, /*$$scope*/ ctx[23], get_menu_slot_context);
    	const menu_slot_or_fallback = menu_slot || fallback_block$6(ctx);
    	let if_block = /*open*/ ctx[0] && create_if_block$d(ctx);

    	let button_levels = [
    		{ type: "button" },
    		{ "aria-haspopup": "" },
    		{ "aria-expanded": /*open*/ ctx[0] },
    		{ "aria-label": /*ariaLabel*/ ctx[13] },
    		{ id: /*id*/ ctx[11] },
    		/*$$restProps*/ ctx[19]
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			t0 = space();
    			button = element("button");
    			if (menu_slot_or_fallback) menu_slot_or_fallback.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			html_tag.a = html_anchor;
    			set_attributes(button, button_data);
    			toggle_class(button, "bx--overflow-menu", true);
    			toggle_class(button, "bx--overflow-menu--open", /*open*/ ctx[0]);
    			toggle_class(button, "bx--overflow-menu--light", /*light*/ ctx[6]);
    			toggle_class(button, "bx--overflow-menu--sm", /*size*/ ctx[4] === 'sm');
    			toggle_class(button, "bx--overflow-menu--xl", /*size*/ ctx[4] === 'xl');
    			add_location(button, file$f, 190, 0, 4542);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*styles*/ ctx[12], document.head);
    			append_dev(document.head, html_anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);

    			if (menu_slot_or_fallback) {
    				menu_slot_or_fallback.m(button, null);
    			}

    			append_dev(button, t1);
    			if (if_block) if_block.m(button, null);
    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[32](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "click", /*click_handler_1*/ ctx[30], false, false, false),
    					listen_dev(button, "click", /*click_handler*/ ctx[25], false, false, false),
    					listen_dev(button, "click", /*click_handler_2*/ ctx[33], false, false, false),
    					listen_dev(button, "mouseover", /*mouseover_handler*/ ctx[26], false, false, false),
    					listen_dev(button, "mouseenter", /*mouseenter_handler*/ ctx[27], false, false, false),
    					listen_dev(button, "mouseleave", /*mouseleave_handler*/ ctx[28], false, false, false),
    					listen_dev(button, "keydown", /*keydown_handler*/ ctx[29], false, false, false),
    					listen_dev(button, "keydown", /*keydown_handler_1*/ ctx[34], false, false, false),
    					listen_dev(button, "focusout", /*focusout_handler*/ ctx[35], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*styles*/ 4096) html_tag.p(/*styles*/ ctx[12]);

    			if (menu_slot) {
    				if (menu_slot.p && (!current || dirty[0] & /*$$scope*/ 8388608)) {
    					update_slot_base(
    						menu_slot,
    						menu_slot_template,
    						ctx,
    						/*$$scope*/ ctx[23],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[23])
    						: get_slot_changes(menu_slot_template, /*$$scope*/ ctx[23], dirty, get_menu_slot_changes),
    						get_menu_slot_context
    					);
    				}
    			} else {
    				if (menu_slot_or_fallback && menu_slot_or_fallback.p && (!current || dirty[0] & /*icon, iconDescription, iconClass*/ 1538)) {
    					menu_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}

    			if (/*open*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*open*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$d(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(button, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				{ type: "button" },
    				{ "aria-haspopup": "" },
    				(!current || dirty[0] & /*open*/ 1) && { "aria-expanded": /*open*/ ctx[0] },
    				(!current || dirty[0] & /*ariaLabel*/ 8192) && { "aria-label": /*ariaLabel*/ ctx[13] },
    				(!current || dirty[0] & /*id*/ 2048) && { id: /*id*/ ctx[11] },
    				dirty[0] & /*$$restProps*/ 524288 && /*$$restProps*/ ctx[19]
    			]));

    			toggle_class(button, "bx--overflow-menu", true);
    			toggle_class(button, "bx--overflow-menu--open", /*open*/ ctx[0]);
    			toggle_class(button, "bx--overflow-menu--light", /*light*/ ctx[6]);
    			toggle_class(button, "bx--overflow-menu--sm", /*size*/ ctx[4] === 'sm');
    			toggle_class(button, "bx--overflow-menu--xl", /*size*/ ctx[4] === 'xl');
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu_slot_or_fallback, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menu_slot_or_fallback, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			if (menu_slot_or_fallback) menu_slot_or_fallback.d(detaching);
    			if (if_block) if_block.d();
    			/*button_binding*/ ctx[32](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let styles;

    	const omit_props_names = [
    		"size","direction","open","light","flipped","menuOptionsClass","icon","iconClass","iconDescription","id","buttonRef","menuRef"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $currentIndex;
    	let $items;
    	let $currentId;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OverflowMenu', slots, ['menu','default']);
    	let { size = undefined } = $$props;
    	let { direction = "bottom" } = $$props;
    	let { open = false } = $$props;
    	let { light = false } = $$props;
    	let { flipped = false } = $$props;
    	let { menuOptionsClass = undefined } = $$props;
    	let { icon = OverflowMenuVertical$1 } = $$props;
    	let { iconClass = undefined } = $$props;
    	let { iconDescription = "Open and close list of options" } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { buttonRef = null } = $$props;
    	let { menuRef = null } = $$props;
    	const ctxBreadcrumbItem = getContext("BreadcrumbItem");
    	const dispatch = createEventDispatcher();
    	const items = writable([]);
    	validate_store(items, 'items');
    	component_subscribe($$self, items, value => $$invalidate(22, $items = value));
    	const currentId = writable(undefined);
    	validate_store(currentId, 'currentId');
    	component_subscribe($$self, currentId, value => $$invalidate(37, $currentId = value));
    	const focusedId = writable(undefined);
    	const currentIndex = writable(-1);
    	validate_store(currentIndex, 'currentIndex');
    	component_subscribe($$self, currentIndex, value => $$invalidate(21, $currentIndex = value));
    	let buttonWidth = undefined;
    	let onMountAfterUpdate = true;

    	setContext("OverflowMenu", {
    		focusedId,
    		add: ({ id, text, primaryFocus, disabled }) => {
    			items.update(_ => {
    				if (primaryFocus) {
    					currentIndex.set(_.length);
    				}

    				return [
    					..._,
    					{
    						id,
    						text,
    						primaryFocus,
    						disabled,
    						index: _.length
    					}
    				];
    			});
    		},
    		update: id => {
    			currentId.set(id);
    		},
    		change: direction => {
    			let index = $currentIndex + direction;

    			if (index < 0) {
    				index = $items.length - 1;
    			} else if (index >= $items.length) {
    				index = 0;
    			}

    			let disabled = $items[index].disabled;

    			while (disabled) {
    				index = index + direction;

    				if (index < 0) {
    					index = $items.length - 1;
    				} else if (index >= $items.length) {
    					index = 0;
    				}

    				disabled = $items[index].disabled;
    			}

    			currentIndex.set(index);
    		}
    	});

    	afterUpdate(() => {
    		if ($currentId) {
    			const { index, text } = $items.filter(_ => _.id === $currentId)[0];
    			dispatch("close", { index, text });
    			$$invalidate(0, open = false);
    		}

    		if (open) {
    			const { width, height } = buttonRef.getBoundingClientRect();
    			$$invalidate(20, buttonWidth = width);

    			if (!onMountAfterUpdate && $currentIndex < 0) {
    				menuRef.focus();
    			}

    			if (flipped) {
    				$$invalidate(3, menuRef.style.left = "auto", menuRef);
    				$$invalidate(3, menuRef.style.right = 0, menuRef);
    			}

    			if (direction === "top") {
    				$$invalidate(3, menuRef.style.top = "auto", menuRef);
    				$$invalidate(3, menuRef.style.bottom = height + "px", menuRef);
    			} else if (direction === "bottom") {
    				$$invalidate(3, menuRef.style.top = height + "px", menuRef);
    			}

    			if (ctxBreadcrumbItem) {
    				$$invalidate(3, menuRef.style.top = height + 10 + "px", menuRef);
    				$$invalidate(3, menuRef.style.left = -11 + "px", menuRef);
    			}
    		}

    		if (!open) {
    			items.set([]);
    			currentId.set(undefined);
    			currentIndex.set(0);
    		}

    		onMountAfterUpdate = false;
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler_1 = ({ target }) => {
    		if (buttonRef && buttonRef.contains(target)) return;

    		if (menuRef && !menuRef.contains(target)) {
    			$$invalidate(0, open = false);
    		}
    	};

    	function ul_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			menuRef = $$value;
    			$$invalidate(3, menuRef);
    		});
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			buttonRef = $$value;
    			$$invalidate(2, buttonRef);
    		});
    	}

    	const click_handler_2 = ({ target }) => {
    		if (!(menuRef && menuRef.contains(target))) {
    			$$invalidate(0, open = !open);
    			if (!open) dispatch('close');
    		}
    	};

    	const keydown_handler_1 = e => {
    		if (open) {
    			if (['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(e.key)) {
    				e.preventDefault();
    			} else if (e.key === 'Escape') {
    				e.stopPropagation();
    				dispatch('close');
    				$$invalidate(0, open = false);
    				buttonRef.focus();
    			}
    		}
    	};

    	const focusout_handler = e => {
    		if (open) {
    			if (!buttonRef.contains(e.relatedTarget)) {
    				dispatch('close');
    				$$invalidate(0, open = false);
    			}
    		}
    	};

    	$$self.$$set = $$new_props => {
    		$$invalidate(39, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(19, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(4, size = $$new_props.size);
    		if ('direction' in $$new_props) $$invalidate(5, direction = $$new_props.direction);
    		if ('open' in $$new_props) $$invalidate(0, open = $$new_props.open);
    		if ('light' in $$new_props) $$invalidate(6, light = $$new_props.light);
    		if ('flipped' in $$new_props) $$invalidate(7, flipped = $$new_props.flipped);
    		if ('menuOptionsClass' in $$new_props) $$invalidate(8, menuOptionsClass = $$new_props.menuOptionsClass);
    		if ('icon' in $$new_props) $$invalidate(1, icon = $$new_props.icon);
    		if ('iconClass' in $$new_props) $$invalidate(9, iconClass = $$new_props.iconClass);
    		if ('iconDescription' in $$new_props) $$invalidate(10, iconDescription = $$new_props.iconDescription);
    		if ('id' in $$new_props) $$invalidate(11, id = $$new_props.id);
    		if ('buttonRef' in $$new_props) $$invalidate(2, buttonRef = $$new_props.buttonRef);
    		if ('menuRef' in $$new_props) $$invalidate(3, menuRef = $$new_props.menuRef);
    		if ('$$scope' in $$new_props) $$invalidate(23, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		size,
    		direction,
    		open,
    		light,
    		flipped,
    		menuOptionsClass,
    		icon,
    		iconClass,
    		iconDescription,
    		id,
    		buttonRef,
    		menuRef,
    		createEventDispatcher,
    		getContext,
    		setContext,
    		afterUpdate,
    		writable,
    		OverflowMenuVertical: OverflowMenuVertical$1,
    		OverflowMenuHorizontal: OverflowMenuHorizontal$1,
    		ctxBreadcrumbItem,
    		dispatch,
    		items,
    		currentId,
    		focusedId,
    		currentIndex,
    		buttonWidth,
    		onMountAfterUpdate,
    		styles,
    		ariaLabel,
    		$currentIndex,
    		$items,
    		$currentId
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(39, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(4, size = $$new_props.size);
    		if ('direction' in $$props) $$invalidate(5, direction = $$new_props.direction);
    		if ('open' in $$props) $$invalidate(0, open = $$new_props.open);
    		if ('light' in $$props) $$invalidate(6, light = $$new_props.light);
    		if ('flipped' in $$props) $$invalidate(7, flipped = $$new_props.flipped);
    		if ('menuOptionsClass' in $$props) $$invalidate(8, menuOptionsClass = $$new_props.menuOptionsClass);
    		if ('icon' in $$props) $$invalidate(1, icon = $$new_props.icon);
    		if ('iconClass' in $$props) $$invalidate(9, iconClass = $$new_props.iconClass);
    		if ('iconDescription' in $$props) $$invalidate(10, iconDescription = $$new_props.iconDescription);
    		if ('id' in $$props) $$invalidate(11, id = $$new_props.id);
    		if ('buttonRef' in $$props) $$invalidate(2, buttonRef = $$new_props.buttonRef);
    		if ('menuRef' in $$props) $$invalidate(3, menuRef = $$new_props.menuRef);
    		if ('buttonWidth' in $$props) $$invalidate(20, buttonWidth = $$new_props.buttonWidth);
    		if ('onMountAfterUpdate' in $$props) onMountAfterUpdate = $$new_props.onMountAfterUpdate;
    		if ('styles' in $$props) $$invalidate(12, styles = $$new_props.styles);
    		if ('ariaLabel' in $$props) $$invalidate(13, ariaLabel = $$new_props.ariaLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(13, ariaLabel = $$props["aria-label"] || "menu");

    		if ($$self.$$.dirty[0] & /*$items, $currentIndex*/ 6291456) {
    			if ($items[$currentIndex]) {
    				focusedId.set($items[$currentIndex].id);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*id, buttonWidth*/ 1050624) {
    			$$invalidate(12, styles = `<style>
    #${id} .bx--overflow-menu-options.bx--overflow-menu-options:after {
      width: ${buttonWidth ? buttonWidth + "px" : "2rem"};
    }
  <\/style>`);
    		}
    	};

    	if (ctxBreadcrumbItem) {
    		$$invalidate(1, icon = OverflowMenuHorizontal$1);
    	}

    	$$props = exclude_internal_props($$props);

    	return [
    		open,
    		icon,
    		buttonRef,
    		menuRef,
    		size,
    		direction,
    		light,
    		flipped,
    		menuOptionsClass,
    		iconClass,
    		iconDescription,
    		id,
    		styles,
    		ariaLabel,
    		ctxBreadcrumbItem,
    		dispatch,
    		items,
    		currentId,
    		currentIndex,
    		$$restProps,
    		buttonWidth,
    		$currentIndex,
    		$items,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keydown_handler,
    		click_handler_1,
    		ul_binding,
    		button_binding,
    		click_handler_2,
    		keydown_handler_1,
    		focusout_handler
    	];
    }

    class OverflowMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$i,
    			create_fragment$i,
    			safe_not_equal,
    			{
    				size: 4,
    				direction: 5,
    				open: 0,
    				light: 6,
    				flipped: 7,
    				menuOptionsClass: 8,
    				icon: 1,
    				iconClass: 9,
    				iconDescription: 10,
    				id: 11,
    				buttonRef: 2,
    				menuRef: 3
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OverflowMenu",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get size() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get direction() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flipped() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flipped(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get menuOptionsClass() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuOptionsClass(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconClass() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconClass(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDescription() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDescription(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonRef() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonRef(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get menuRef() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuRef(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var OverflowMenu$1 = OverflowMenu;

    /* node_modules/carbon-components-svelte/src/DataTable/ToolbarMenu.svelte generated by Svelte v3.55.1 */

    // (16:0) <OverflowMenu   bind:menuRef   icon="{Settings}"   {...$$restProps}   class="bx--toolbar-action bx--overflow-menu {$$restProps.class}"   flipped >
    function create_default_slot$4(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(16:0) <OverflowMenu   bind:menuRef   icon=\\\"{Settings}\\\"   {...$$restProps}   class=\\\"bx--toolbar-action bx--overflow-menu {$$restProps.class}\\\"   flipped >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let overflowmenu;
    	let updating_menuRef;
    	let current;

    	const overflowmenu_spread_levels = [
    		{ icon: Settings$1 },
    		/*$$restProps*/ ctx[1],
    		{
    			class: "bx--toolbar-action bx--overflow-menu " + /*$$restProps*/ ctx[1].class
    		},
    		{ flipped: true }
    	];

    	function overflowmenu_menuRef_binding(value) {
    		/*overflowmenu_menuRef_binding*/ ctx[3](value);
    	}

    	let overflowmenu_props = {
    		$$slots: { default: [create_default_slot$4] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < overflowmenu_spread_levels.length; i += 1) {
    		overflowmenu_props = assign(overflowmenu_props, overflowmenu_spread_levels[i]);
    	}

    	if (/*menuRef*/ ctx[0] !== void 0) {
    		overflowmenu_props.menuRef = /*menuRef*/ ctx[0];
    	}

    	overflowmenu = new OverflowMenu$1({
    			props: overflowmenu_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(overflowmenu, 'menuRef', overflowmenu_menuRef_binding));

    	const block = {
    		c: function create() {
    			create_component(overflowmenu.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(overflowmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const overflowmenu_changes = (dirty & /*Settings, $$restProps*/ 2)
    			? get_spread_update(overflowmenu_spread_levels, [
    					dirty & /*Settings*/ 0 && { icon: Settings$1 },
    					dirty & /*$$restProps*/ 2 && get_spread_object(/*$$restProps*/ ctx[1]),
    					dirty & /*$$restProps*/ 2 && {
    						class: "bx--toolbar-action bx--overflow-menu " + /*$$restProps*/ ctx[1].class
    					},
    					overflowmenu_spread_levels[3]
    				])
    			: {};

    			if (dirty & /*$$scope*/ 16) {
    				overflowmenu_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_menuRef && dirty & /*menuRef*/ 1) {
    				updating_menuRef = true;
    				overflowmenu_changes.menuRef = /*menuRef*/ ctx[0];
    				add_flush_callback(() => updating_menuRef = false);
    			}

    			overflowmenu.$set(overflowmenu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overflowmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overflowmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(overflowmenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ToolbarMenu', slots, ['default']);
    	const ctx = getContext("Toolbar");
    	let menuRef = null;

    	function overflowmenu_menuRef_binding(value) {
    		menuRef = value;
    		$$invalidate(0, menuRef);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('$$scope' in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		Settings: Settings$1,
    		OverflowMenu: OverflowMenu$1,
    		ctx,
    		menuRef
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('menuRef' in $$props) $$invalidate(0, menuRef = $$new_props.menuRef);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*menuRef*/ 1) {
    			if (menuRef) $$invalidate(0, menuRef.style.top = "100%", menuRef);
    		}

    		if ($$self.$$.dirty & /*menuRef*/ 1) {
    			ctx.setOverflowVisible(menuRef != null);
    		}
    	};

    	return [menuRef, $$restProps, slots, overflowmenu_menuRef_binding, $$scope];
    }

    class ToolbarMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToolbarMenu",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    var ToolbarMenu$1 = ToolbarMenu;

    /* node_modules/carbon-components-svelte/src/OverflowMenu/OverflowMenuItem.svelte generated by Svelte v3.55.1 */
    const file$e = "node_modules/carbon-components-svelte/src/OverflowMenu/OverflowMenuItem.svelte";

    // (88:2) {:else}
    function create_else_block$3(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);
    	const default_slot_or_fallback = default_slot || fallback_block_1$3(ctx);
    	let button_levels = [/*buttonProps*/ ctx[7]];
    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    			add_location(button, file$e, 88, 4, 2234);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[24](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler_1*/ ctx[19], false, false, false),
    					listen_dev(button, "click", /*click_handler_3*/ ctx[25], false, false, false),
    					listen_dev(button, "keydown", /*keydown_handler_1*/ ctx[20], false, false, false),
    					listen_dev(button, "keydown", /*keydown_handler_3*/ ctx[26], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*text*/ 2)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [dirty & /*buttonProps*/ 128 && /*buttonProps*/ ctx[7]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*button_binding*/ ctx[24](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(88:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (64:2) {#if href}
    function create_if_block$c(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);
    	const default_slot_or_fallback = default_slot || fallback_block$5(ctx);
    	let a_levels = [/*buttonProps*/ ctx[7]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(a, a_data);
    			add_location(a, file$e, 65, 4, 1766);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(a, null);
    			}

    			/*a_binding*/ ctx[21](a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[17], false, false, false),
    					listen_dev(a, "click", /*click_handler_2*/ ctx[22], false, false, false),
    					listen_dev(a, "keydown", /*keydown_handler*/ ctx[18], false, false, false),
    					listen_dev(a, "keydown", /*keydown_handler_2*/ ctx[23], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*text*/ 2)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [dirty & /*buttonProps*/ 128 && /*buttonProps*/ ctx[7]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*a_binding*/ ctx[21](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(64:2) {#if href}",
    		ctx
    	});

    	return block;
    }

    // (105:12)
    function fallback_block_1$3(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*text*/ ctx[1]);
    			toggle_class(div, "bx--overflow-menu-options__option-content", true);
    			add_location(div, file$e, 105, 8, 2575);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*text*/ 2) set_data_dev(t, /*text*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1$3.name,
    		type: "fallback",
    		source: "(105:12)          ",
    		ctx
    	});

    	return block;
    }

    // (82:12)
    function fallback_block$5(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*text*/ ctx[1]);
    			toggle_class(div, "bx--overflow-menu-options__option-content", true);
    			add_location(div, file$e, 82, 8, 2102);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*text*/ 2) set_data_dev(t, /*text*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$5.name,
    		type: "fallback",
    		source: "(82:12)          ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let li;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$c, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let li_levels = [{ role: "none" }, { id: /*id*/ ctx[6] }, /*$$restProps*/ ctx[11]];
    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if_block.c();
    			set_attributes(li, li_data);
    			toggle_class(li, "bx--overflow-menu-options__option", true);
    			toggle_class(li, "bx--overflow-menu--divider", /*hasDivider*/ ctx[4]);
    			toggle_class(li, "bx--overflow-menu-options__option--danger", /*danger*/ ctx[5]);
    			toggle_class(li, "bx--overflow-menu-options__option--disabled", /*disabled*/ ctx[3]);
    			add_location(li, file$e, 54, 0, 1421);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			if_blocks[current_block_type_index].m(li, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(li, null);
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				{ role: "none" },
    				(!current || dirty & /*id*/ 64) && { id: /*id*/ ctx[6] },
    				dirty & /*$$restProps*/ 2048 && /*$$restProps*/ ctx[11]
    			]));

    			toggle_class(li, "bx--overflow-menu-options__option", true);
    			toggle_class(li, "bx--overflow-menu--divider", /*hasDivider*/ ctx[4]);
    			toggle_class(li, "bx--overflow-menu-options__option--danger", /*danger*/ ctx[5]);
    			toggle_class(li, "bx--overflow-menu-options__option--disabled", /*disabled*/ ctx[3]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let buttonProps;

    	const omit_props_names = [
    		"text","href","primaryFocus","disabled","hasDivider","danger","requireTitle","id","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $focusedId;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OverflowMenuItem', slots, ['default']);
    	const $$slots = compute_slots(slots);
    	let { text = "Provide text" } = $$props;
    	let { href = "" } = $$props;
    	let { primaryFocus = false } = $$props;
    	let { disabled = false } = $$props;
    	let { hasDivider = false } = $$props;
    	let { danger = false } = $$props;
    	let { requireTitle = true } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { ref = null } = $$props;
    	const { focusedId, add, update, change } = getContext("OverflowMenu");
    	validate_store(focusedId, 'focusedId');
    	component_subscribe($$self, focusedId, value => $$invalidate(14, $focusedId = value));
    	add({ id, text, primaryFocus, disabled });

    	afterUpdate(() => {
    		if (ref && primaryFocus) {
    			ref.focus();
    		}
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	const click_handler_2 = () => {
    		update(id);
    	};

    	const keydown_handler_2 = ({ key }) => {
    		if (key === 'ArrowDown') {
    			change(1);
    		} else if (key === 'ArrowUp') {
    			change(-1);
    		}
    	};

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	const click_handler_3 = () => {
    		update(id);
    	};

    	const keydown_handler_3 = ({ key }) => {
    		if (key === 'ArrowDown') {
    			change(1);
    		} else if (key === 'ArrowUp') {
    			change(-1);
    		}
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('text' in $$new_props) $$invalidate(1, text = $$new_props.text);
    		if ('href' in $$new_props) $$invalidate(2, href = $$new_props.href);
    		if ('primaryFocus' in $$new_props) $$invalidate(12, primaryFocus = $$new_props.primaryFocus);
    		if ('disabled' in $$new_props) $$invalidate(3, disabled = $$new_props.disabled);
    		if ('hasDivider' in $$new_props) $$invalidate(4, hasDivider = $$new_props.hasDivider);
    		if ('danger' in $$new_props) $$invalidate(5, danger = $$new_props.danger);
    		if ('requireTitle' in $$new_props) $$invalidate(13, requireTitle = $$new_props.requireTitle);
    		if ('id' in $$new_props) $$invalidate(6, id = $$new_props.id);
    		if ('ref' in $$new_props) $$invalidate(0, ref = $$new_props.ref);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		text,
    		href,
    		primaryFocus,
    		disabled,
    		hasDivider,
    		danger,
    		requireTitle,
    		id,
    		ref,
    		getContext,
    		afterUpdate,
    		focusedId,
    		add,
    		update,
    		change,
    		buttonProps,
    		$focusedId
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('text' in $$props) $$invalidate(1, text = $$new_props.text);
    		if ('href' in $$props) $$invalidate(2, href = $$new_props.href);
    		if ('primaryFocus' in $$props) $$invalidate(12, primaryFocus = $$new_props.primaryFocus);
    		if ('disabled' in $$props) $$invalidate(3, disabled = $$new_props.disabled);
    		if ('hasDivider' in $$props) $$invalidate(4, hasDivider = $$new_props.hasDivider);
    		if ('danger' in $$props) $$invalidate(5, danger = $$new_props.danger);
    		if ('requireTitle' in $$props) $$invalidate(13, requireTitle = $$new_props.requireTitle);
    		if ('id' in $$props) $$invalidate(6, id = $$new_props.id);
    		if ('ref' in $$props) $$invalidate(0, ref = $$new_props.ref);
    		if ('buttonProps' in $$props) $$invalidate(7, buttonProps = $$new_props.buttonProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$focusedId, id*/ 16448) {
    			$$invalidate(12, primaryFocus = $focusedId === id);
    		}

    		if ($$self.$$.dirty & /*href, disabled, requireTitle, text*/ 8206) {
    			$$invalidate(7, buttonProps = {
    				role: "menuitem",
    				tabindex: "-1",
    				class: "bx--overflow-menu-options__btn",
    				disabled: href ? undefined : disabled,
    				href: href ? href : undefined,
    				title: requireTitle
    				? $$slots.default ? undefined : text
    				: undefined
    			});
    		}
    	};

    	return [
    		ref,
    		text,
    		href,
    		disabled,
    		hasDivider,
    		danger,
    		id,
    		buttonProps,
    		focusedId,
    		update,
    		change,
    		$$restProps,
    		primaryFocus,
    		requireTitle,
    		$focusedId,
    		$$scope,
    		slots,
    		click_handler,
    		keydown_handler,
    		click_handler_1,
    		keydown_handler_1,
    		a_binding,
    		click_handler_2,
    		keydown_handler_2,
    		button_binding,
    		click_handler_3,
    		keydown_handler_3
    	];
    }

    class OverflowMenuItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			text: 1,
    			href: 2,
    			primaryFocus: 12,
    			disabled: 3,
    			hasDivider: 4,
    			danger: 5,
    			requireTitle: 13,
    			id: 6,
    			ref: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OverflowMenuItem",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get text() {
    		throw new Error("<OverflowMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<OverflowMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<OverflowMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<OverflowMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primaryFocus() {
    		throw new Error("<OverflowMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primaryFocus(value) {
    		throw new Error("<OverflowMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<OverflowMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<OverflowMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasDivider() {
    		throw new Error("<OverflowMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasDivider(value) {
    		throw new Error("<OverflowMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get danger() {
    		throw new Error("<OverflowMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set danger(value) {
    		throw new Error("<OverflowMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get requireTitle() {
    		throw new Error("<OverflowMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set requireTitle(value) {
    		throw new Error("<OverflowMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<OverflowMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<OverflowMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<OverflowMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<OverflowMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var OverflowMenuItem$1 = OverflowMenuItem;

    /* node_modules/carbon-components-svelte/src/DataTable/ToolbarMenuItem.svelte generated by Svelte v3.55.1 */

    // (7:0) <OverflowMenuItem {...$$restProps} on:click on:keydown>
    function create_default_slot$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(7:0) <OverflowMenuItem {...$$restProps} on:click on:keydown>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let overflowmenuitem;
    	let current;
    	const overflowmenuitem_spread_levels = [/*$$restProps*/ ctx[0]];

    	let overflowmenuitem_props = {
    		$$slots: { default: [create_default_slot$3] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < overflowmenuitem_spread_levels.length; i += 1) {
    		overflowmenuitem_props = assign(overflowmenuitem_props, overflowmenuitem_spread_levels[i]);
    	}

    	overflowmenuitem = new OverflowMenuItem$1({
    			props: overflowmenuitem_props,
    			$$inline: true
    		});

    	overflowmenuitem.$on("click", /*click_handler*/ ctx[2]);
    	overflowmenuitem.$on("keydown", /*keydown_handler*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(overflowmenuitem.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(overflowmenuitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const overflowmenuitem_changes = (dirty & /*$$restProps*/ 1)
    			? get_spread_update(overflowmenuitem_spread_levels, [get_spread_object(/*$$restProps*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 16) {
    				overflowmenuitem_changes.$$scope = { dirty, ctx };
    			}

    			overflowmenuitem.$set(overflowmenuitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overflowmenuitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overflowmenuitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(overflowmenuitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ToolbarMenuItem', slots, ['default']);

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(0, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('$$scope' in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ OverflowMenuItem: OverflowMenuItem$1 });
    	return [$$restProps, slots, click_handler, keydown_handler, $$scope];
    }

    class ToolbarMenuItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToolbarMenuItem",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    var ToolbarMenuItem$1 = ToolbarMenuItem;

    const HOOKS = [
        "onChange",
        "onClose",
        "onDayCreate",
        "onDestroy",
        "onKeyDown",
        "onMonthChange",
        "onOpen",
        "onParseConfig",
        "onReady",
        "onValueUpdate",
        "onYearChange",
        "onPreCalendarPosition",
    ];
    const defaults = {
        _disable: [],
        allowInput: false,
        allowInvalidPreload: false,
        altFormat: "F j, Y",
        altInput: false,
        altInputClass: "form-control input",
        animate: typeof window === "object" &&
            window.navigator.userAgent.indexOf("MSIE") === -1,
        ariaDateFormat: "F j, Y",
        autoFillDefaultTime: true,
        clickOpens: true,
        closeOnSelect: true,
        conjunction: ", ",
        dateFormat: "Y-m-d",
        defaultHour: 12,
        defaultMinute: 0,
        defaultSeconds: 0,
        disable: [],
        disableMobile: false,
        enableSeconds: false,
        enableTime: false,
        errorHandler: (err) => typeof console !== "undefined" && console.warn(err),
        getWeek: (givenDate) => {
            const date = new Date(givenDate.getTime());
            date.setHours(0, 0, 0, 0);
            date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
            var week1 = new Date(date.getFullYear(), 0, 4);
            return (1 +
                Math.round(((date.getTime() - week1.getTime()) / 86400000 -
                    3 +
                    ((week1.getDay() + 6) % 7)) /
                    7));
        },
        hourIncrement: 1,
        ignoredFocusElements: [],
        inline: false,
        locale: "default",
        minuteIncrement: 5,
        mode: "single",
        monthSelectorType: "dropdown",
        nextArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",
        noCalendar: false,
        now: new Date(),
        onChange: [],
        onClose: [],
        onDayCreate: [],
        onDestroy: [],
        onKeyDown: [],
        onMonthChange: [],
        onOpen: [],
        onParseConfig: [],
        onReady: [],
        onValueUpdate: [],
        onYearChange: [],
        onPreCalendarPosition: [],
        plugins: [],
        position: "auto",
        positionElement: undefined,
        prevArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",
        shorthandCurrentMonth: false,
        showMonths: 1,
        static: false,
        time_24hr: false,
        weekNumbers: false,
        wrap: false,
    };

    const english = {
        weekdays: {
            shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            longhand: [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ],
        },
        months: {
            shorthand: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
            longhand: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ],
        },
        daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        firstDayOfWeek: 0,
        ordinal: (nth) => {
            const s = nth % 100;
            if (s > 3 && s < 21)
                return "th";
            switch (s % 10) {
                case 1:
                    return "st";
                case 2:
                    return "nd";
                case 3:
                    return "rd";
                default:
                    return "th";
            }
        },
        rangeSeparator: " to ",
        weekAbbreviation: "Wk",
        scrollTitle: "Scroll to increment",
        toggleTitle: "Click to toggle",
        amPM: ["AM", "PM"],
        yearAriaLabel: "Year",
        monthAriaLabel: "Month",
        hourAriaLabel: "Hour",
        minuteAriaLabel: "Minute",
        time_24hr: false,
    };

    const pad = (number, length = 2) => `000${number}`.slice(length * -1);
    const int = (bool) => (bool === true ? 1 : 0);
    function debounce(fn, wait) {
        let t;
        return function () {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, arguments), wait);
        };
    }
    const arrayify = (obj) => obj instanceof Array ? obj : [obj];

    function toggleClass(elem, className, bool) {
        if (bool === true)
            return elem.classList.add(className);
        elem.classList.remove(className);
    }
    function createElement(tag, className, content) {
        const e = window.document.createElement(tag);
        className = className || "";
        content = content || "";
        e.className = className;
        if (content !== undefined)
            e.textContent = content;
        return e;
    }
    function clearNode(node) {
        while (node.firstChild)
            node.removeChild(node.firstChild);
    }
    function findParent(node, condition) {
        if (condition(node))
            return node;
        else if (node.parentNode)
            return findParent(node.parentNode, condition);
        return undefined;
    }
    function createNumberInput(inputClassName, opts) {
        const wrapper = createElement("div", "numInputWrapper"), numInput = createElement("input", "numInput " + inputClassName), arrowUp = createElement("span", "arrowUp"), arrowDown = createElement("span", "arrowDown");
        if (navigator.userAgent.indexOf("MSIE 9.0") === -1) {
            numInput.type = "number";
        }
        else {
            numInput.type = "text";
            numInput.pattern = "\\d*";
        }
        if (opts !== undefined)
            for (const key in opts)
                numInput.setAttribute(key, opts[key]);
        wrapper.appendChild(numInput);
        wrapper.appendChild(arrowUp);
        wrapper.appendChild(arrowDown);
        return wrapper;
    }
    function getEventTarget(event) {
        try {
            if (typeof event.composedPath === "function") {
                const path = event.composedPath();
                return path[0];
            }
            return event.target;
        }
        catch (error) {
            return event.target;
        }
    }

    const doNothing = () => undefined;
    const monthToStr = (monthNumber, shorthand, locale) => locale.months[shorthand ? "shorthand" : "longhand"][monthNumber];
    const revFormat = {
        D: doNothing,
        F: function (dateObj, monthName, locale) {
            dateObj.setMonth(locale.months.longhand.indexOf(monthName));
        },
        G: (dateObj, hour) => {
            dateObj.setHours(parseFloat(hour));
        },
        H: (dateObj, hour) => {
            dateObj.setHours(parseFloat(hour));
        },
        J: (dateObj, day) => {
            dateObj.setDate(parseFloat(day));
        },
        K: (dateObj, amPM, locale) => {
            dateObj.setHours((dateObj.getHours() % 12) +
                12 * int(new RegExp(locale.amPM[1], "i").test(amPM)));
        },
        M: function (dateObj, shortMonth, locale) {
            dateObj.setMonth(locale.months.shorthand.indexOf(shortMonth));
        },
        S: (dateObj, seconds) => {
            dateObj.setSeconds(parseFloat(seconds));
        },
        U: (_, unixSeconds) => new Date(parseFloat(unixSeconds) * 1000),
        W: function (dateObj, weekNum, locale) {
            const weekNumber = parseInt(weekNum);
            const date = new Date(dateObj.getFullYear(), 0, 2 + (weekNumber - 1) * 7, 0, 0, 0, 0);
            date.setDate(date.getDate() - date.getDay() + locale.firstDayOfWeek);
            return date;
        },
        Y: (dateObj, year) => {
            dateObj.setFullYear(parseFloat(year));
        },
        Z: (_, ISODate) => new Date(ISODate),
        d: (dateObj, day) => {
            dateObj.setDate(parseFloat(day));
        },
        h: (dateObj, hour) => {
            dateObj.setHours(parseFloat(hour));
        },
        i: (dateObj, minutes) => {
            dateObj.setMinutes(parseFloat(minutes));
        },
        j: (dateObj, day) => {
            dateObj.setDate(parseFloat(day));
        },
        l: doNothing,
        m: (dateObj, month) => {
            dateObj.setMonth(parseFloat(month) - 1);
        },
        n: (dateObj, month) => {
            dateObj.setMonth(parseFloat(month) - 1);
        },
        s: (dateObj, seconds) => {
            dateObj.setSeconds(parseFloat(seconds));
        },
        u: (_, unixMillSeconds) => new Date(parseFloat(unixMillSeconds)),
        w: doNothing,
        y: (dateObj, year) => {
            dateObj.setFullYear(2000 + parseFloat(year));
        },
    };
    const tokenRegex = {
        D: "(\\w+)",
        F: "(\\w+)",
        G: "(\\d\\d|\\d)",
        H: "(\\d\\d|\\d)",
        J: "(\\d\\d|\\d)\\w+",
        K: "",
        M: "(\\w+)",
        S: "(\\d\\d|\\d)",
        U: "(.+)",
        W: "(\\d\\d|\\d)",
        Y: "(\\d{4})",
        Z: "(.+)",
        d: "(\\d\\d|\\d)",
        h: "(\\d\\d|\\d)",
        i: "(\\d\\d|\\d)",
        j: "(\\d\\d|\\d)",
        l: "(\\w+)",
        m: "(\\d\\d|\\d)",
        n: "(\\d\\d|\\d)",
        s: "(\\d\\d|\\d)",
        u: "(.+)",
        w: "(\\d\\d|\\d)",
        y: "(\\d{2})",
    };
    const formats = {
        Z: (date) => date.toISOString(),
        D: function (date, locale, options) {
            return locale.weekdays.shorthand[formats.w(date, locale, options)];
        },
        F: function (date, locale, options) {
            return monthToStr(formats.n(date, locale, options) - 1, false, locale);
        },
        G: function (date, locale, options) {
            return pad(formats.h(date, locale, options));
        },
        H: (date) => pad(date.getHours()),
        J: function (date, locale) {
            return locale.ordinal !== undefined
                ? date.getDate() + locale.ordinal(date.getDate())
                : date.getDate();
        },
        K: (date, locale) => locale.amPM[int(date.getHours() > 11)],
        M: function (date, locale) {
            return monthToStr(date.getMonth(), true, locale);
        },
        S: (date) => pad(date.getSeconds()),
        U: (date) => date.getTime() / 1000,
        W: function (date, _, options) {
            return options.getWeek(date);
        },
        Y: (date) => pad(date.getFullYear(), 4),
        d: (date) => pad(date.getDate()),
        h: (date) => (date.getHours() % 12 ? date.getHours() % 12 : 12),
        i: (date) => pad(date.getMinutes()),
        j: (date) => date.getDate(),
        l: function (date, locale) {
            return locale.weekdays.longhand[date.getDay()];
        },
        m: (date) => pad(date.getMonth() + 1),
        n: (date) => date.getMonth() + 1,
        s: (date) => date.getSeconds(),
        u: (date) => date.getTime(),
        w: (date) => date.getDay(),
        y: (date) => String(date.getFullYear()).substring(2),
    };

    const createDateFormatter = ({ config = defaults, l10n = english, isMobile = false, }) => (dateObj, frmt, overrideLocale) => {
        const locale = overrideLocale || l10n;
        if (config.formatDate !== undefined && !isMobile) {
            return config.formatDate(dateObj, frmt, locale);
        }
        return frmt
            .split("")
            .map((c, i, arr) => formats[c] && arr[i - 1] !== "\\"
            ? formats[c](dateObj, locale, config)
            : c !== "\\"
                ? c
                : "")
            .join("");
    };
    const createDateParser = ({ config = defaults, l10n = english }) => (date, givenFormat, timeless, customLocale) => {
        if (date !== 0 && !date)
            return undefined;
        const locale = customLocale || l10n;
        let parsedDate;
        const dateOrig = date;
        if (date instanceof Date)
            parsedDate = new Date(date.getTime());
        else if (typeof date !== "string" &&
            date.toFixed !== undefined)
            parsedDate = new Date(date);
        else if (typeof date === "string") {
            const format = givenFormat || (config || defaults).dateFormat;
            const datestr = String(date).trim();
            if (datestr === "today") {
                parsedDate = new Date();
                timeless = true;
            }
            else if (/Z$/.test(datestr) ||
                /GMT$/.test(datestr))
                parsedDate = new Date(date);
            else if (config && config.parseDate)
                parsedDate = config.parseDate(date, format);
            else {
                parsedDate =
                    !config || !config.noCalendar
                        ? new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0)
                        : new Date(new Date().setHours(0, 0, 0, 0));
                let matched, ops = [];
                for (let i = 0, matchIndex = 0, regexStr = ""; i < format.length; i++) {
                    const token = format[i];
                    const isBackSlash = token === "\\";
                    const escaped = format[i - 1] === "\\" || isBackSlash;
                    if (tokenRegex[token] && !escaped) {
                        regexStr += tokenRegex[token];
                        const match = new RegExp(regexStr).exec(date);
                        if (match && (matched = true)) {
                            ops[token !== "Y" ? "push" : "unshift"]({
                                fn: revFormat[token],
                                val: match[++matchIndex],
                            });
                        }
                    }
                    else if (!isBackSlash)
                        regexStr += ".";
                    ops.forEach(({ fn, val }) => (parsedDate = fn(parsedDate, val, locale) || parsedDate));
                }
                parsedDate = matched ? parsedDate : undefined;
            }
        }
        if (!(parsedDate instanceof Date && !isNaN(parsedDate.getTime()))) {
            config.errorHandler(new Error(`Invalid date provided: ${dateOrig}`));
            return undefined;
        }
        if (timeless === true)
            parsedDate.setHours(0, 0, 0, 0);
        return parsedDate;
    };
    function compareDates(date1, date2, timeless = true) {
        if (timeless !== false) {
            return (new Date(date1.getTime()).setHours(0, 0, 0, 0) -
                new Date(date2.getTime()).setHours(0, 0, 0, 0));
        }
        return date1.getTime() - date2.getTime();
    }
    const isBetween = (ts, ts1, ts2) => {
        return ts > Math.min(ts1, ts2) && ts < Math.max(ts1, ts2);
    };
    const duration = {
        DAY: 86400000,
    };
    function getDefaultHours(config) {
        let hours = config.defaultHour;
        let minutes = config.defaultMinute;
        let seconds = config.defaultSeconds;
        if (config.minDate !== undefined) {
            const minHour = config.minDate.getHours();
            const minMinutes = config.minDate.getMinutes();
            const minSeconds = config.minDate.getSeconds();
            if (hours < minHour) {
                hours = minHour;
            }
            if (hours === minHour && minutes < minMinutes) {
                minutes = minMinutes;
            }
            if (hours === minHour && minutes === minMinutes && seconds < minSeconds)
                seconds = config.minDate.getSeconds();
        }
        if (config.maxDate !== undefined) {
            const maxHr = config.maxDate.getHours();
            const maxMinutes = config.maxDate.getMinutes();
            hours = Math.min(hours, maxHr);
            if (hours === maxHr)
                minutes = Math.min(maxMinutes, minutes);
            if (hours === maxHr && minutes === maxMinutes)
                seconds = config.maxDate.getSeconds();
        }
        return { hours, minutes, seconds };
    }

    if (typeof Object.assign !== "function") {
        Object.assign = function (target, ...args) {
            if (!target) {
                throw TypeError("Cannot convert undefined or null to object");
            }
            for (const source of args) {
                if (source) {
                    Object.keys(source).forEach((key) => (target[key] = source[key]));
                }
            }
            return target;
        };
    }

    const DEBOUNCED_CHANGE_MS = 300;
    function FlatpickrInstance(element, instanceConfig) {
        const self = {
            config: Object.assign(Object.assign({}, defaults), flatpickr.defaultConfig),
            l10n: english,
        };
        self.parseDate = createDateParser({ config: self.config, l10n: self.l10n });
        self._handlers = [];
        self.pluginElements = [];
        self.loadedPlugins = [];
        self._bind = bind;
        self._setHoursFromDate = setHoursFromDate;
        self._positionCalendar = positionCalendar;
        self.changeMonth = changeMonth;
        self.changeYear = changeYear;
        self.clear = clear;
        self.close = close;
        self._createElement = createElement;
        self.destroy = destroy;
        self.isEnabled = isEnabled;
        self.jumpToDate = jumpToDate;
        self.open = open;
        self.redraw = redraw;
        self.set = set;
        self.setDate = setDate;
        self.toggle = toggle;
        function setupHelperFunctions() {
            self.utils = {
                getDaysInMonth(month = self.currentMonth, yr = self.currentYear) {
                    if (month === 1 && ((yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0))
                        return 29;
                    return self.l10n.daysInMonth[month];
                },
            };
        }
        function init() {
            self.element = self.input = element;
            self.isOpen = false;
            parseConfig();
            setupLocale();
            setupInputs();
            setupDates();
            setupHelperFunctions();
            if (!self.isMobile)
                build();
            bindEvents();
            if (self.selectedDates.length || self.config.noCalendar) {
                if (self.config.enableTime) {
                    setHoursFromDate(self.config.noCalendar ? self.latestSelectedDateObj : undefined);
                }
                updateValue(false);
            }
            setCalendarWidth();
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            if (!self.isMobile && isSafari) {
                positionCalendar();
            }
            triggerEvent("onReady");
        }
        function bindToInstance(fn) {
            return fn.bind(self);
        }
        function setCalendarWidth() {
            const config = self.config;
            if (config.weekNumbers === false && config.showMonths === 1) {
                return;
            }
            else if (config.noCalendar !== true) {
                window.requestAnimationFrame(function () {
                    if (self.calendarContainer !== undefined) {
                        self.calendarContainer.style.visibility = "hidden";
                        self.calendarContainer.style.display = "block";
                    }
                    if (self.daysContainer !== undefined) {
                        const daysWidth = (self.days.offsetWidth + 1) * config.showMonths;
                        self.daysContainer.style.width = daysWidth + "px";
                        self.calendarContainer.style.width =
                            daysWidth +
                                (self.weekWrapper !== undefined
                                    ? self.weekWrapper.offsetWidth
                                    : 0) +
                                "px";
                        self.calendarContainer.style.removeProperty("visibility");
                        self.calendarContainer.style.removeProperty("display");
                    }
                });
            }
        }
        function updateTime(e) {
            if (self.selectedDates.length === 0) {
                const defaultDate = self.config.minDate === undefined ||
                    compareDates(new Date(), self.config.minDate) >= 0
                    ? new Date()
                    : new Date(self.config.minDate.getTime());
                const defaults = getDefaultHours(self.config);
                defaultDate.setHours(defaults.hours, defaults.minutes, defaults.seconds, defaultDate.getMilliseconds());
                self.selectedDates = [defaultDate];
                self.latestSelectedDateObj = defaultDate;
            }
            if (e !== undefined && e.type !== "blur") {
                timeWrapper(e);
            }
            const prevValue = self._input.value;
            setHoursFromInputs();
            updateValue();
            if (self._input.value !== prevValue) {
                self._debouncedChange();
            }
        }
        function ampm2military(hour, amPM) {
            return (hour % 12) + 12 * int(amPM === self.l10n.amPM[1]);
        }
        function military2ampm(hour) {
            switch (hour % 24) {
                case 0:
                case 12:
                    return 12;
                default:
                    return hour % 12;
            }
        }
        function setHoursFromInputs() {
            if (self.hourElement === undefined || self.minuteElement === undefined)
                return;
            let hours = (parseInt(self.hourElement.value.slice(-2), 10) || 0) % 24, minutes = (parseInt(self.minuteElement.value, 10) || 0) % 60, seconds = self.secondElement !== undefined
                ? (parseInt(self.secondElement.value, 10) || 0) % 60
                : 0;
            if (self.amPM !== undefined) {
                hours = ampm2military(hours, self.amPM.textContent);
            }
            const limitMinHours = self.config.minTime !== undefined ||
                (self.config.minDate &&
                    self.minDateHasTime &&
                    self.latestSelectedDateObj &&
                    compareDates(self.latestSelectedDateObj, self.config.minDate, true) ===
                        0);
            const limitMaxHours = self.config.maxTime !== undefined ||
                (self.config.maxDate &&
                    self.maxDateHasTime &&
                    self.latestSelectedDateObj &&
                    compareDates(self.latestSelectedDateObj, self.config.maxDate, true) ===
                        0);
            if (limitMaxHours) {
                const maxTime = self.config.maxTime !== undefined
                    ? self.config.maxTime
                    : self.config.maxDate;
                hours = Math.min(hours, maxTime.getHours());
                if (hours === maxTime.getHours())
                    minutes = Math.min(minutes, maxTime.getMinutes());
                if (minutes === maxTime.getMinutes())
                    seconds = Math.min(seconds, maxTime.getSeconds());
            }
            if (limitMinHours) {
                const minTime = self.config.minTime !== undefined
                    ? self.config.minTime
                    : self.config.minDate;
                hours = Math.max(hours, minTime.getHours());
                if (hours === minTime.getHours() && minutes < minTime.getMinutes())
                    minutes = minTime.getMinutes();
                if (minutes === minTime.getMinutes())
                    seconds = Math.max(seconds, minTime.getSeconds());
            }
            setHours(hours, minutes, seconds);
        }
        function setHoursFromDate(dateObj) {
            const date = dateObj || self.latestSelectedDateObj;
            if (date) {
                setHours(date.getHours(), date.getMinutes(), date.getSeconds());
            }
        }
        function setHours(hours, minutes, seconds) {
            if (self.latestSelectedDateObj !== undefined) {
                self.latestSelectedDateObj.setHours(hours % 24, minutes, seconds || 0, 0);
            }
            if (!self.hourElement || !self.minuteElement || self.isMobile)
                return;
            self.hourElement.value = pad(!self.config.time_24hr
                ? ((12 + hours) % 12) + 12 * int(hours % 12 === 0)
                : hours);
            self.minuteElement.value = pad(minutes);
            if (self.amPM !== undefined)
                self.amPM.textContent = self.l10n.amPM[int(hours >= 12)];
            if (self.secondElement !== undefined)
                self.secondElement.value = pad(seconds);
        }
        function onYearInput(event) {
            const eventTarget = getEventTarget(event);
            const year = parseInt(eventTarget.value) + (event.delta || 0);
            if (year / 1000 > 1 ||
                (event.key === "Enter" && !/[^\d]/.test(year.toString()))) {
                changeYear(year);
            }
        }
        function bind(element, event, handler, options) {
            if (event instanceof Array)
                return event.forEach((ev) => bind(element, ev, handler, options));
            if (element instanceof Array)
                return element.forEach((el) => bind(el, event, handler, options));
            element.addEventListener(event, handler, options);
            self._handlers.push({
                remove: () => element.removeEventListener(event, handler),
            });
        }
        function triggerChange() {
            triggerEvent("onChange");
        }
        function bindEvents() {
            if (self.config.wrap) {
                ["open", "close", "toggle", "clear"].forEach((evt) => {
                    Array.prototype.forEach.call(self.element.querySelectorAll(`[data-${evt}]`), (el) => bind(el, "click", self[evt]));
                });
            }
            if (self.isMobile) {
                setupMobile();
                return;
            }
            const debouncedResize = debounce(onResize, 50);
            self._debouncedChange = debounce(triggerChange, DEBOUNCED_CHANGE_MS);
            if (self.daysContainer && !/iPhone|iPad|iPod/i.test(navigator.userAgent))
                bind(self.daysContainer, "mouseover", (e) => {
                    if (self.config.mode === "range")
                        onMouseOver(getEventTarget(e));
                });
            bind(window.document.body, "keydown", onKeyDown);
            if (!self.config.inline && !self.config.static)
                bind(window, "resize", debouncedResize);
            if (window.ontouchstart !== undefined)
                bind(window.document, "touchstart", documentClick);
            else
                bind(window.document, "mousedown", documentClick);
            bind(window.document, "focus", documentClick, { capture: true });
            if (self.config.clickOpens === true) {
                bind(self._input, "focus", self.open);
                bind(self._input, "click", self.open);
            }
            if (self.daysContainer !== undefined) {
                bind(self.monthNav, "click", onMonthNavClick);
                bind(self.monthNav, ["keyup", "increment"], onYearInput);
                bind(self.daysContainer, "click", selectDate);
            }
            if (self.timeContainer !== undefined &&
                self.minuteElement !== undefined &&
                self.hourElement !== undefined) {
                const selText = (e) => getEventTarget(e).select();
                bind(self.timeContainer, ["increment"], updateTime);
                bind(self.timeContainer, "blur", updateTime, { capture: true });
                bind(self.timeContainer, "click", timeIncrement);
                bind([self.hourElement, self.minuteElement], ["focus", "click"], selText);
                if (self.secondElement !== undefined)
                    bind(self.secondElement, "focus", () => self.secondElement && self.secondElement.select());
                if (self.amPM !== undefined) {
                    bind(self.amPM, "click", (e) => {
                        updateTime(e);
                        triggerChange();
                    });
                }
            }
            if (self.config.allowInput) {
                bind(self._input, "blur", onBlur);
            }
        }
        function jumpToDate(jumpDate, triggerChange) {
            const jumpTo = jumpDate !== undefined
                ? self.parseDate(jumpDate)
                : self.latestSelectedDateObj ||
                    (self.config.minDate && self.config.minDate > self.now
                        ? self.config.minDate
                        : self.config.maxDate && self.config.maxDate < self.now
                            ? self.config.maxDate
                            : self.now);
            const oldYear = self.currentYear;
            const oldMonth = self.currentMonth;
            try {
                if (jumpTo !== undefined) {
                    self.currentYear = jumpTo.getFullYear();
                    self.currentMonth = jumpTo.getMonth();
                }
            }
            catch (e) {
                e.message = "Invalid date supplied: " + jumpTo;
                self.config.errorHandler(e);
            }
            if (triggerChange && self.currentYear !== oldYear) {
                triggerEvent("onYearChange");
                buildMonthSwitch();
            }
            if (triggerChange &&
                (self.currentYear !== oldYear || self.currentMonth !== oldMonth)) {
                triggerEvent("onMonthChange");
            }
            self.redraw();
        }
        function timeIncrement(e) {
            const eventTarget = getEventTarget(e);
            if (~eventTarget.className.indexOf("arrow"))
                incrementNumInput(e, eventTarget.classList.contains("arrowUp") ? 1 : -1);
        }
        function incrementNumInput(e, delta, inputElem) {
            const target = e && getEventTarget(e);
            const input = inputElem ||
                (target && target.parentNode && target.parentNode.firstChild);
            const event = createEvent("increment");
            event.delta = delta;
            input && input.dispatchEvent(event);
        }
        function build() {
            const fragment = window.document.createDocumentFragment();
            self.calendarContainer = createElement("div", "flatpickr-calendar");
            self.calendarContainer.tabIndex = -1;
            if (!self.config.noCalendar) {
                fragment.appendChild(buildMonthNav());
                self.innerContainer = createElement("div", "flatpickr-innerContainer");
                if (self.config.weekNumbers) {
                    const { weekWrapper, weekNumbers } = buildWeeks();
                    self.innerContainer.appendChild(weekWrapper);
                    self.weekNumbers = weekNumbers;
                    self.weekWrapper = weekWrapper;
                }
                self.rContainer = createElement("div", "flatpickr-rContainer");
                self.rContainer.appendChild(buildWeekdays());
                if (!self.daysContainer) {
                    self.daysContainer = createElement("div", "flatpickr-days");
                    self.daysContainer.tabIndex = -1;
                }
                buildDays();
                self.rContainer.appendChild(self.daysContainer);
                self.innerContainer.appendChild(self.rContainer);
                fragment.appendChild(self.innerContainer);
            }
            if (self.config.enableTime) {
                fragment.appendChild(buildTime());
            }
            toggleClass(self.calendarContainer, "rangeMode", self.config.mode === "range");
            toggleClass(self.calendarContainer, "animate", self.config.animate === true);
            toggleClass(self.calendarContainer, "multiMonth", self.config.showMonths > 1);
            self.calendarContainer.appendChild(fragment);
            const customAppend = self.config.appendTo !== undefined &&
                self.config.appendTo.nodeType !== undefined;
            if (self.config.inline || self.config.static) {
                self.calendarContainer.classList.add(self.config.inline ? "inline" : "static");
                if (self.config.inline) {
                    if (!customAppend && self.element.parentNode)
                        self.element.parentNode.insertBefore(self.calendarContainer, self._input.nextSibling);
                    else if (self.config.appendTo !== undefined)
                        self.config.appendTo.appendChild(self.calendarContainer);
                }
                if (self.config.static) {
                    const wrapper = createElement("div", "flatpickr-wrapper");
                    if (self.element.parentNode)
                        self.element.parentNode.insertBefore(wrapper, self.element);
                    wrapper.appendChild(self.element);
                    if (self.altInput)
                        wrapper.appendChild(self.altInput);
                    wrapper.appendChild(self.calendarContainer);
                }
            }
            if (!self.config.static && !self.config.inline)
                (self.config.appendTo !== undefined
                    ? self.config.appendTo
                    : window.document.body).appendChild(self.calendarContainer);
        }
        function createDay(className, date, dayNumber, i) {
            const dateIsEnabled = isEnabled(date, true), dayElement = createElement("span", "flatpickr-day " + className, date.getDate().toString());
            dayElement.dateObj = date;
            dayElement.$i = i;
            dayElement.setAttribute("aria-label", self.formatDate(date, self.config.ariaDateFormat));
            if (className.indexOf("hidden") === -1 &&
                compareDates(date, self.now) === 0) {
                self.todayDateElem = dayElement;
                dayElement.classList.add("today");
                dayElement.setAttribute("aria-current", "date");
            }
            if (dateIsEnabled) {
                dayElement.tabIndex = -1;
                if (isDateSelected(date)) {
                    dayElement.classList.add("selected");
                    self.selectedDateElem = dayElement;
                    if (self.config.mode === "range") {
                        toggleClass(dayElement, "startRange", self.selectedDates[0] &&
                            compareDates(date, self.selectedDates[0], true) === 0);
                        toggleClass(dayElement, "endRange", self.selectedDates[1] &&
                            compareDates(date, self.selectedDates[1], true) === 0);
                        if (className === "nextMonthDay")
                            dayElement.classList.add("inRange");
                    }
                }
            }
            else {
                dayElement.classList.add("flatpickr-disabled");
            }
            if (self.config.mode === "range") {
                if (isDateInRange(date) && !isDateSelected(date))
                    dayElement.classList.add("inRange");
            }
            if (self.weekNumbers &&
                self.config.showMonths === 1 &&
                className !== "prevMonthDay" &&
                dayNumber % 7 === 1) {
                self.weekNumbers.insertAdjacentHTML("beforeend", "<span class='flatpickr-day'>" + self.config.getWeek(date) + "</span>");
            }
            triggerEvent("onDayCreate", dayElement);
            return dayElement;
        }
        function focusOnDayElem(targetNode) {
            targetNode.focus();
            if (self.config.mode === "range")
                onMouseOver(targetNode);
        }
        function getFirstAvailableDay(delta) {
            const startMonth = delta > 0 ? 0 : self.config.showMonths - 1;
            const endMonth = delta > 0 ? self.config.showMonths : -1;
            for (let m = startMonth; m != endMonth; m += delta) {
                const month = self.daysContainer.children[m];
                const startIndex = delta > 0 ? 0 : month.children.length - 1;
                const endIndex = delta > 0 ? month.children.length : -1;
                for (let i = startIndex; i != endIndex; i += delta) {
                    const c = month.children[i];
                    if (c.className.indexOf("hidden") === -1 && isEnabled(c.dateObj))
                        return c;
                }
            }
            return undefined;
        }
        function getNextAvailableDay(current, delta) {
            const givenMonth = current.className.indexOf("Month") === -1
                ? current.dateObj.getMonth()
                : self.currentMonth;
            const endMonth = delta > 0 ? self.config.showMonths : -1;
            const loopDelta = delta > 0 ? 1 : -1;
            for (let m = givenMonth - self.currentMonth; m != endMonth; m += loopDelta) {
                const month = self.daysContainer.children[m];
                const startIndex = givenMonth - self.currentMonth === m
                    ? current.$i + delta
                    : delta < 0
                        ? month.children.length - 1
                        : 0;
                const numMonthDays = month.children.length;
                for (let i = startIndex; i >= 0 && i < numMonthDays && i != (delta > 0 ? numMonthDays : -1); i += loopDelta) {
                    const c = month.children[i];
                    if (c.className.indexOf("hidden") === -1 &&
                        isEnabled(c.dateObj) &&
                        Math.abs(current.$i - i) >= Math.abs(delta))
                        return focusOnDayElem(c);
                }
            }
            self.changeMonth(loopDelta);
            focusOnDay(getFirstAvailableDay(loopDelta), 0);
            return undefined;
        }
        function focusOnDay(current, offset) {
            const dayFocused = isInView(document.activeElement || document.body);
            const startElem = current !== undefined
                ? current
                : dayFocused
                    ? document.activeElement
                    : self.selectedDateElem !== undefined && isInView(self.selectedDateElem)
                        ? self.selectedDateElem
                        : self.todayDateElem !== undefined && isInView(self.todayDateElem)
                            ? self.todayDateElem
                            : getFirstAvailableDay(offset > 0 ? 1 : -1);
            if (startElem === undefined) {
                self._input.focus();
            }
            else if (!dayFocused) {
                focusOnDayElem(startElem);
            }
            else {
                getNextAvailableDay(startElem, offset);
            }
        }
        function buildMonthDays(year, month) {
            const firstOfMonth = (new Date(year, month, 1).getDay() - self.l10n.firstDayOfWeek + 7) % 7;
            const prevMonthDays = self.utils.getDaysInMonth((month - 1 + 12) % 12, year);
            const daysInMonth = self.utils.getDaysInMonth(month, year), days = window.document.createDocumentFragment(), isMultiMonth = self.config.showMonths > 1, prevMonthDayClass = isMultiMonth ? "prevMonthDay hidden" : "prevMonthDay", nextMonthDayClass = isMultiMonth ? "nextMonthDay hidden" : "nextMonthDay";
            let dayNumber = prevMonthDays + 1 - firstOfMonth, dayIndex = 0;
            for (; dayNumber <= prevMonthDays; dayNumber++, dayIndex++) {
                days.appendChild(createDay(prevMonthDayClass, new Date(year, month - 1, dayNumber), dayNumber, dayIndex));
            }
            for (dayNumber = 1; dayNumber <= daysInMonth; dayNumber++, dayIndex++) {
                days.appendChild(createDay("", new Date(year, month, dayNumber), dayNumber, dayIndex));
            }
            for (let dayNum = daysInMonth + 1; dayNum <= 42 - firstOfMonth &&
                (self.config.showMonths === 1 || dayIndex % 7 !== 0); dayNum++, dayIndex++) {
                days.appendChild(createDay(nextMonthDayClass, new Date(year, month + 1, dayNum % daysInMonth), dayNum, dayIndex));
            }
            const dayContainer = createElement("div", "dayContainer");
            dayContainer.appendChild(days);
            return dayContainer;
        }
        function buildDays() {
            if (self.daysContainer === undefined) {
                return;
            }
            clearNode(self.daysContainer);
            if (self.weekNumbers)
                clearNode(self.weekNumbers);
            const frag = document.createDocumentFragment();
            for (let i = 0; i < self.config.showMonths; i++) {
                const d = new Date(self.currentYear, self.currentMonth, 1);
                d.setMonth(self.currentMonth + i);
                frag.appendChild(buildMonthDays(d.getFullYear(), d.getMonth()));
            }
            self.daysContainer.appendChild(frag);
            self.days = self.daysContainer.firstChild;
            if (self.config.mode === "range" && self.selectedDates.length === 1) {
                onMouseOver();
            }
        }
        function buildMonthSwitch() {
            if (self.config.showMonths > 1 ||
                self.config.monthSelectorType !== "dropdown")
                return;
            const shouldBuildMonth = function (month) {
                if (self.config.minDate !== undefined &&
                    self.currentYear === self.config.minDate.getFullYear() &&
                    month < self.config.minDate.getMonth()) {
                    return false;
                }
                return !(self.config.maxDate !== undefined &&
                    self.currentYear === self.config.maxDate.getFullYear() &&
                    month > self.config.maxDate.getMonth());
            };
            self.monthsDropdownContainer.tabIndex = -1;
            self.monthsDropdownContainer.innerHTML = "";
            for (let i = 0; i < 12; i++) {
                if (!shouldBuildMonth(i))
                    continue;
                const month = createElement("option", "flatpickr-monthDropdown-month");
                month.value = new Date(self.currentYear, i).getMonth().toString();
                month.textContent = monthToStr(i, self.config.shorthandCurrentMonth, self.l10n);
                month.tabIndex = -1;
                if (self.currentMonth === i) {
                    month.selected = true;
                }
                self.monthsDropdownContainer.appendChild(month);
            }
        }
        function buildMonth() {
            const container = createElement("div", "flatpickr-month");
            const monthNavFragment = window.document.createDocumentFragment();
            let monthElement;
            if (self.config.showMonths > 1 ||
                self.config.monthSelectorType === "static") {
                monthElement = createElement("span", "cur-month");
            }
            else {
                self.monthsDropdownContainer = createElement("select", "flatpickr-monthDropdown-months");
                self.monthsDropdownContainer.setAttribute("aria-label", self.l10n.monthAriaLabel);
                bind(self.monthsDropdownContainer, "change", (e) => {
                    const target = getEventTarget(e);
                    const selectedMonth = parseInt(target.value, 10);
                    self.changeMonth(selectedMonth - self.currentMonth);
                    triggerEvent("onMonthChange");
                });
                buildMonthSwitch();
                monthElement = self.monthsDropdownContainer;
            }
            const yearInput = createNumberInput("cur-year", { tabindex: "-1" });
            const yearElement = yearInput.getElementsByTagName("input")[0];
            yearElement.setAttribute("aria-label", self.l10n.yearAriaLabel);
            if (self.config.minDate) {
                yearElement.setAttribute("min", self.config.minDate.getFullYear().toString());
            }
            if (self.config.maxDate) {
                yearElement.setAttribute("max", self.config.maxDate.getFullYear().toString());
                yearElement.disabled =
                    !!self.config.minDate &&
                        self.config.minDate.getFullYear() === self.config.maxDate.getFullYear();
            }
            const currentMonth = createElement("div", "flatpickr-current-month");
            currentMonth.appendChild(monthElement);
            currentMonth.appendChild(yearInput);
            monthNavFragment.appendChild(currentMonth);
            container.appendChild(monthNavFragment);
            return {
                container,
                yearElement,
                monthElement,
            };
        }
        function buildMonths() {
            clearNode(self.monthNav);
            self.monthNav.appendChild(self.prevMonthNav);
            if (self.config.showMonths) {
                self.yearElements = [];
                self.monthElements = [];
            }
            for (let m = self.config.showMonths; m--;) {
                const month = buildMonth();
                self.yearElements.push(month.yearElement);
                self.monthElements.push(month.monthElement);
                self.monthNav.appendChild(month.container);
            }
            self.monthNav.appendChild(self.nextMonthNav);
        }
        function buildMonthNav() {
            self.monthNav = createElement("div", "flatpickr-months");
            self.yearElements = [];
            self.monthElements = [];
            self.prevMonthNav = createElement("span", "flatpickr-prev-month");
            self.prevMonthNav.innerHTML = self.config.prevArrow;
            self.nextMonthNav = createElement("span", "flatpickr-next-month");
            self.nextMonthNav.innerHTML = self.config.nextArrow;
            buildMonths();
            Object.defineProperty(self, "_hidePrevMonthArrow", {
                get: () => self.__hidePrevMonthArrow,
                set(bool) {
                    if (self.__hidePrevMonthArrow !== bool) {
                        toggleClass(self.prevMonthNav, "flatpickr-disabled", bool);
                        self.__hidePrevMonthArrow = bool;
                    }
                },
            });
            Object.defineProperty(self, "_hideNextMonthArrow", {
                get: () => self.__hideNextMonthArrow,
                set(bool) {
                    if (self.__hideNextMonthArrow !== bool) {
                        toggleClass(self.nextMonthNav, "flatpickr-disabled", bool);
                        self.__hideNextMonthArrow = bool;
                    }
                },
            });
            self.currentYearElement = self.yearElements[0];
            updateNavigationCurrentMonth();
            return self.monthNav;
        }
        function buildTime() {
            self.calendarContainer.classList.add("hasTime");
            if (self.config.noCalendar)
                self.calendarContainer.classList.add("noCalendar");
            const defaults = getDefaultHours(self.config);
            self.timeContainer = createElement("div", "flatpickr-time");
            self.timeContainer.tabIndex = -1;
            const separator = createElement("span", "flatpickr-time-separator", ":");
            const hourInput = createNumberInput("flatpickr-hour", {
                "aria-label": self.l10n.hourAriaLabel,
            });
            self.hourElement = hourInput.getElementsByTagName("input")[0];
            const minuteInput = createNumberInput("flatpickr-minute", {
                "aria-label": self.l10n.minuteAriaLabel,
            });
            self.minuteElement = minuteInput.getElementsByTagName("input")[0];
            self.hourElement.tabIndex = self.minuteElement.tabIndex = -1;
            self.hourElement.value = pad(self.latestSelectedDateObj
                ? self.latestSelectedDateObj.getHours()
                : self.config.time_24hr
                    ? defaults.hours
                    : military2ampm(defaults.hours));
            self.minuteElement.value = pad(self.latestSelectedDateObj
                ? self.latestSelectedDateObj.getMinutes()
                : defaults.minutes);
            self.hourElement.setAttribute("step", self.config.hourIncrement.toString());
            self.minuteElement.setAttribute("step", self.config.minuteIncrement.toString());
            self.hourElement.setAttribute("min", self.config.time_24hr ? "0" : "1");
            self.hourElement.setAttribute("max", self.config.time_24hr ? "23" : "12");
            self.hourElement.setAttribute("maxlength", "2");
            self.minuteElement.setAttribute("min", "0");
            self.minuteElement.setAttribute("max", "59");
            self.minuteElement.setAttribute("maxlength", "2");
            self.timeContainer.appendChild(hourInput);
            self.timeContainer.appendChild(separator);
            self.timeContainer.appendChild(minuteInput);
            if (self.config.time_24hr)
                self.timeContainer.classList.add("time24hr");
            if (self.config.enableSeconds) {
                self.timeContainer.classList.add("hasSeconds");
                const secondInput = createNumberInput("flatpickr-second");
                self.secondElement = secondInput.getElementsByTagName("input")[0];
                self.secondElement.value = pad(self.latestSelectedDateObj
                    ? self.latestSelectedDateObj.getSeconds()
                    : defaults.seconds);
                self.secondElement.setAttribute("step", self.minuteElement.getAttribute("step"));
                self.secondElement.setAttribute("min", "0");
                self.secondElement.setAttribute("max", "59");
                self.secondElement.setAttribute("maxlength", "2");
                self.timeContainer.appendChild(createElement("span", "flatpickr-time-separator", ":"));
                self.timeContainer.appendChild(secondInput);
            }
            if (!self.config.time_24hr) {
                self.amPM = createElement("span", "flatpickr-am-pm", self.l10n.amPM[int((self.latestSelectedDateObj
                    ? self.hourElement.value
                    : self.config.defaultHour) > 11)]);
                self.amPM.title = self.l10n.toggleTitle;
                self.amPM.tabIndex = -1;
                self.timeContainer.appendChild(self.amPM);
            }
            return self.timeContainer;
        }
        function buildWeekdays() {
            if (!self.weekdayContainer)
                self.weekdayContainer = createElement("div", "flatpickr-weekdays");
            else
                clearNode(self.weekdayContainer);
            for (let i = self.config.showMonths; i--;) {
                const container = createElement("div", "flatpickr-weekdaycontainer");
                self.weekdayContainer.appendChild(container);
            }
            updateWeekdays();
            return self.weekdayContainer;
        }
        function updateWeekdays() {
            if (!self.weekdayContainer) {
                return;
            }
            const firstDayOfWeek = self.l10n.firstDayOfWeek;
            let weekdays = [...self.l10n.weekdays.shorthand];
            if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
                weekdays = [
                    ...weekdays.splice(firstDayOfWeek, weekdays.length),
                    ...weekdays.splice(0, firstDayOfWeek),
                ];
            }
            for (let i = self.config.showMonths; i--;) {
                self.weekdayContainer.children[i].innerHTML = `
      <span class='flatpickr-weekday'>
        ${weekdays.join("</span><span class='flatpickr-weekday'>")}
      </span>
      `;
            }
        }
        function buildWeeks() {
            self.calendarContainer.classList.add("hasWeeks");
            const weekWrapper = createElement("div", "flatpickr-weekwrapper");
            weekWrapper.appendChild(createElement("span", "flatpickr-weekday", self.l10n.weekAbbreviation));
            const weekNumbers = createElement("div", "flatpickr-weeks");
            weekWrapper.appendChild(weekNumbers);
            return {
                weekWrapper,
                weekNumbers,
            };
        }
        function changeMonth(value, isOffset = true) {
            const delta = isOffset ? value : value - self.currentMonth;
            if ((delta < 0 && self._hidePrevMonthArrow === true) ||
                (delta > 0 && self._hideNextMonthArrow === true))
                return;
            self.currentMonth += delta;
            if (self.currentMonth < 0 || self.currentMonth > 11) {
                self.currentYear += self.currentMonth > 11 ? 1 : -1;
                self.currentMonth = (self.currentMonth + 12) % 12;
                triggerEvent("onYearChange");
                buildMonthSwitch();
            }
            buildDays();
            triggerEvent("onMonthChange");
            updateNavigationCurrentMonth();
        }
        function clear(triggerChangeEvent = true, toInitial = true) {
            self.input.value = "";
            if (self.altInput !== undefined)
                self.altInput.value = "";
            if (self.mobileInput !== undefined)
                self.mobileInput.value = "";
            self.selectedDates = [];
            self.latestSelectedDateObj = undefined;
            if (toInitial === true) {
                self.currentYear = self._initialDate.getFullYear();
                self.currentMonth = self._initialDate.getMonth();
            }
            if (self.config.enableTime === true) {
                const { hours, minutes, seconds } = getDefaultHours(self.config);
                setHours(hours, minutes, seconds);
            }
            self.redraw();
            if (triggerChangeEvent)
                triggerEvent("onChange");
        }
        function close() {
            self.isOpen = false;
            if (!self.isMobile) {
                if (self.calendarContainer !== undefined) {
                    self.calendarContainer.classList.remove("open");
                }
                if (self._input !== undefined) {
                    self._input.classList.remove("active");
                }
            }
            triggerEvent("onClose");
        }
        function destroy() {
            if (self.config !== undefined)
                triggerEvent("onDestroy");
            for (let i = self._handlers.length; i--;) {
                self._handlers[i].remove();
            }
            self._handlers = [];
            if (self.mobileInput) {
                if (self.mobileInput.parentNode)
                    self.mobileInput.parentNode.removeChild(self.mobileInput);
                self.mobileInput = undefined;
            }
            else if (self.calendarContainer && self.calendarContainer.parentNode) {
                if (self.config.static && self.calendarContainer.parentNode) {
                    const wrapper = self.calendarContainer.parentNode;
                    wrapper.lastChild && wrapper.removeChild(wrapper.lastChild);
                    if (wrapper.parentNode) {
                        while (wrapper.firstChild)
                            wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
                        wrapper.parentNode.removeChild(wrapper);
                    }
                }
                else
                    self.calendarContainer.parentNode.removeChild(self.calendarContainer);
            }
            if (self.altInput) {
                self.input.type = "text";
                if (self.altInput.parentNode)
                    self.altInput.parentNode.removeChild(self.altInput);
                delete self.altInput;
            }
            if (self.input) {
                self.input.type = self.input._type;
                self.input.classList.remove("flatpickr-input");
                self.input.removeAttribute("readonly");
            }
            [
                "_showTimeInput",
                "latestSelectedDateObj",
                "_hideNextMonthArrow",
                "_hidePrevMonthArrow",
                "__hideNextMonthArrow",
                "__hidePrevMonthArrow",
                "isMobile",
                "isOpen",
                "selectedDateElem",
                "minDateHasTime",
                "maxDateHasTime",
                "days",
                "daysContainer",
                "_input",
                "_positionElement",
                "innerContainer",
                "rContainer",
                "monthNav",
                "todayDateElem",
                "calendarContainer",
                "weekdayContainer",
                "prevMonthNav",
                "nextMonthNav",
                "monthsDropdownContainer",
                "currentMonthElement",
                "currentYearElement",
                "navigationCurrentMonth",
                "selectedDateElem",
                "config",
            ].forEach((k) => {
                try {
                    delete self[k];
                }
                catch (_) { }
            });
        }
        function isCalendarElem(elem) {
            if (self.config.appendTo && self.config.appendTo.contains(elem))
                return true;
            return self.calendarContainer.contains(elem);
        }
        function documentClick(e) {
            if (self.isOpen && !self.config.inline) {
                const eventTarget = getEventTarget(e);
                const isCalendarElement = isCalendarElem(eventTarget);
                const isInput = eventTarget === self.input ||
                    eventTarget === self.altInput ||
                    self.element.contains(eventTarget) ||
                    (e.path &&
                        e.path.indexOf &&
                        (~e.path.indexOf(self.input) ||
                            ~e.path.indexOf(self.altInput)));
                const lostFocus = e.type === "blur"
                    ? isInput &&
                        e.relatedTarget &&
                        !isCalendarElem(e.relatedTarget)
                    : !isInput &&
                        !isCalendarElement &&
                        !isCalendarElem(e.relatedTarget);
                const isIgnored = !self.config.ignoredFocusElements.some((elem) => elem.contains(eventTarget));
                if (lostFocus && isIgnored) {
                    if (self.timeContainer !== undefined &&
                        self.minuteElement !== undefined &&
                        self.hourElement !== undefined &&
                        self.input.value !== "" &&
                        self.input.value !== undefined) {
                        updateTime();
                    }
                    self.close();
                    if (self.config &&
                        self.config.mode === "range" &&
                        self.selectedDates.length === 1) {
                        self.clear(false);
                        self.redraw();
                    }
                }
            }
        }
        function changeYear(newYear) {
            if (!newYear ||
                (self.config.minDate && newYear < self.config.minDate.getFullYear()) ||
                (self.config.maxDate && newYear > self.config.maxDate.getFullYear()))
                return;
            const newYearNum = newYear, isNewYear = self.currentYear !== newYearNum;
            self.currentYear = newYearNum || self.currentYear;
            if (self.config.maxDate &&
                self.currentYear === self.config.maxDate.getFullYear()) {
                self.currentMonth = Math.min(self.config.maxDate.getMonth(), self.currentMonth);
            }
            else if (self.config.minDate &&
                self.currentYear === self.config.minDate.getFullYear()) {
                self.currentMonth = Math.max(self.config.minDate.getMonth(), self.currentMonth);
            }
            if (isNewYear) {
                self.redraw();
                triggerEvent("onYearChange");
                buildMonthSwitch();
            }
        }
        function isEnabled(date, timeless = true) {
            var _a;
            const dateToCheck = self.parseDate(date, undefined, timeless);
            if ((self.config.minDate &&
                dateToCheck &&
                compareDates(dateToCheck, self.config.minDate, timeless !== undefined ? timeless : !self.minDateHasTime) < 0) ||
                (self.config.maxDate &&
                    dateToCheck &&
                    compareDates(dateToCheck, self.config.maxDate, timeless !== undefined ? timeless : !self.maxDateHasTime) > 0))
                return false;
            if (!self.config.enable && self.config.disable.length === 0)
                return true;
            if (dateToCheck === undefined)
                return false;
            const bool = !!self.config.enable, array = (_a = self.config.enable) !== null && _a !== void 0 ? _a : self.config.disable;
            for (let i = 0, d; i < array.length; i++) {
                d = array[i];
                if (typeof d === "function" &&
                    d(dateToCheck))
                    return bool;
                else if (d instanceof Date &&
                    dateToCheck !== undefined &&
                    d.getTime() === dateToCheck.getTime())
                    return bool;
                else if (typeof d === "string") {
                    const parsed = self.parseDate(d, undefined, true);
                    return parsed && parsed.getTime() === dateToCheck.getTime()
                        ? bool
                        : !bool;
                }
                else if (typeof d === "object" &&
                    dateToCheck !== undefined &&
                    d.from &&
                    d.to &&
                    dateToCheck.getTime() >= d.from.getTime() &&
                    dateToCheck.getTime() <= d.to.getTime())
                    return bool;
            }
            return !bool;
        }
        function isInView(elem) {
            if (self.daysContainer !== undefined)
                return (elem.className.indexOf("hidden") === -1 &&
                    elem.className.indexOf("flatpickr-disabled") === -1 &&
                    self.daysContainer.contains(elem));
            return false;
        }
        function onBlur(e) {
            const isInput = e.target === self._input;
            if (isInput &&
                (self.selectedDates.length > 0 || self._input.value.length > 0) &&
                !(e.relatedTarget && isCalendarElem(e.relatedTarget))) {
                self.setDate(self._input.value, true, e.target === self.altInput
                    ? self.config.altFormat
                    : self.config.dateFormat);
            }
        }
        function onKeyDown(e) {
            const eventTarget = getEventTarget(e);
            const isInput = self.config.wrap
                ? element.contains(eventTarget)
                : eventTarget === self._input;
            const allowInput = self.config.allowInput;
            const allowKeydown = self.isOpen && (!allowInput || !isInput);
            const allowInlineKeydown = self.config.inline && isInput && !allowInput;
            if (e.keyCode === 13 && isInput) {
                if (allowInput) {
                    self.setDate(self._input.value, true, eventTarget === self.altInput
                        ? self.config.altFormat
                        : self.config.dateFormat);
                    return eventTarget.blur();
                }
                else {
                    self.open();
                }
            }
            else if (isCalendarElem(eventTarget) ||
                allowKeydown ||
                allowInlineKeydown) {
                const isTimeObj = !!self.timeContainer &&
                    self.timeContainer.contains(eventTarget);
                switch (e.keyCode) {
                    case 13:
                        if (isTimeObj) {
                            e.preventDefault();
                            updateTime();
                            focusAndClose();
                        }
                        else
                            selectDate(e);
                        break;
                    case 27:
                        e.preventDefault();
                        focusAndClose();
                        break;
                    case 8:
                    case 46:
                        if (isInput && !self.config.allowInput) {
                            e.preventDefault();
                            self.clear();
                        }
                        break;
                    case 37:
                    case 39:
                        if (!isTimeObj && !isInput) {
                            e.preventDefault();
                            if (self.daysContainer !== undefined &&
                                (allowInput === false ||
                                    (document.activeElement && isInView(document.activeElement)))) {
                                const delta = e.keyCode === 39 ? 1 : -1;
                                if (!e.ctrlKey)
                                    focusOnDay(undefined, delta);
                                else {
                                    e.stopPropagation();
                                    changeMonth(delta);
                                    focusOnDay(getFirstAvailableDay(1), 0);
                                }
                            }
                        }
                        else if (self.hourElement)
                            self.hourElement.focus();
                        break;
                    case 38:
                    case 40:
                        e.preventDefault();
                        const delta = e.keyCode === 40 ? 1 : -1;
                        if ((self.daysContainer &&
                            eventTarget.$i !== undefined) ||
                            eventTarget === self.input ||
                            eventTarget === self.altInput) {
                            if (e.ctrlKey) {
                                e.stopPropagation();
                                changeYear(self.currentYear - delta);
                                focusOnDay(getFirstAvailableDay(1), 0);
                            }
                            else if (!isTimeObj)
                                focusOnDay(undefined, delta * 7);
                        }
                        else if (eventTarget === self.currentYearElement) {
                            changeYear(self.currentYear - delta);
                        }
                        else if (self.config.enableTime) {
                            if (!isTimeObj && self.hourElement)
                                self.hourElement.focus();
                            updateTime(e);
                            self._debouncedChange();
                        }
                        break;
                    case 9:
                        if (isTimeObj) {
                            const elems = [
                                self.hourElement,
                                self.minuteElement,
                                self.secondElement,
                                self.amPM,
                            ]
                                .concat(self.pluginElements)
                                .filter((x) => x);
                            const i = elems.indexOf(eventTarget);
                            if (i !== -1) {
                                const target = elems[i + (e.shiftKey ? -1 : 1)];
                                e.preventDefault();
                                (target || self._input).focus();
                            }
                        }
                        else if (!self.config.noCalendar &&
                            self.daysContainer &&
                            self.daysContainer.contains(eventTarget) &&
                            e.shiftKey) {
                            e.preventDefault();
                            self._input.focus();
                        }
                        break;
                }
            }
            if (self.amPM !== undefined && eventTarget === self.amPM) {
                switch (e.key) {
                    case self.l10n.amPM[0].charAt(0):
                    case self.l10n.amPM[0].charAt(0).toLowerCase():
                        self.amPM.textContent = self.l10n.amPM[0];
                        setHoursFromInputs();
                        updateValue();
                        break;
                    case self.l10n.amPM[1].charAt(0):
                    case self.l10n.amPM[1].charAt(0).toLowerCase():
                        self.amPM.textContent = self.l10n.amPM[1];
                        setHoursFromInputs();
                        updateValue();
                        break;
                }
            }
            if (isInput || isCalendarElem(eventTarget)) {
                triggerEvent("onKeyDown", e);
            }
        }
        function onMouseOver(elem) {
            if (self.selectedDates.length !== 1 ||
                (elem &&
                    (!elem.classList.contains("flatpickr-day") ||
                        elem.classList.contains("flatpickr-disabled"))))
                return;
            const hoverDate = elem
                ? elem.dateObj.getTime()
                : self.days.firstElementChild.dateObj.getTime(), initialDate = self.parseDate(self.selectedDates[0], undefined, true).getTime(), rangeStartDate = Math.min(hoverDate, self.selectedDates[0].getTime()), rangeEndDate = Math.max(hoverDate, self.selectedDates[0].getTime());
            let containsDisabled = false;
            let minRange = 0, maxRange = 0;
            for (let t = rangeStartDate; t < rangeEndDate; t += duration.DAY) {
                if (!isEnabled(new Date(t), true)) {
                    containsDisabled =
                        containsDisabled || (t > rangeStartDate && t < rangeEndDate);
                    if (t < initialDate && (!minRange || t > minRange))
                        minRange = t;
                    else if (t > initialDate && (!maxRange || t < maxRange))
                        maxRange = t;
                }
            }
            for (let m = 0; m < self.config.showMonths; m++) {
                const month = self.daysContainer.children[m];
                for (let i = 0, l = month.children.length; i < l; i++) {
                    const dayElem = month.children[i], date = dayElem.dateObj;
                    const timestamp = date.getTime();
                    const outOfRange = (minRange > 0 && timestamp < minRange) ||
                        (maxRange > 0 && timestamp > maxRange);
                    if (outOfRange) {
                        dayElem.classList.add("notAllowed");
                        ["inRange", "startRange", "endRange"].forEach((c) => {
                            dayElem.classList.remove(c);
                        });
                        continue;
                    }
                    else if (containsDisabled && !outOfRange)
                        continue;
                    ["startRange", "inRange", "endRange", "notAllowed"].forEach((c) => {
                        dayElem.classList.remove(c);
                    });
                    if (elem !== undefined) {
                        elem.classList.add(hoverDate <= self.selectedDates[0].getTime()
                            ? "startRange"
                            : "endRange");
                        if (initialDate < hoverDate && timestamp === initialDate)
                            dayElem.classList.add("startRange");
                        else if (initialDate > hoverDate && timestamp === initialDate)
                            dayElem.classList.add("endRange");
                        if (timestamp >= minRange &&
                            (maxRange === 0 || timestamp <= maxRange) &&
                            isBetween(timestamp, initialDate, hoverDate))
                            dayElem.classList.add("inRange");
                    }
                }
            }
        }
        function onResize() {
            if (self.isOpen && !self.config.static && !self.config.inline)
                positionCalendar();
        }
        function open(e, positionElement = self._positionElement) {
            if (self.isMobile === true) {
                if (e) {
                    e.preventDefault();
                    const eventTarget = getEventTarget(e);
                    if (eventTarget) {
                        eventTarget.blur();
                    }
                }
                if (self.mobileInput !== undefined) {
                    self.mobileInput.focus();
                    self.mobileInput.click();
                }
                triggerEvent("onOpen");
                return;
            }
            else if (self._input.disabled || self.config.inline) {
                return;
            }
            const wasOpen = self.isOpen;
            self.isOpen = true;
            if (!wasOpen) {
                self.calendarContainer.classList.add("open");
                self._input.classList.add("active");
                triggerEvent("onOpen");
                positionCalendar(positionElement);
            }
            if (self.config.enableTime === true && self.config.noCalendar === true) {
                if (self.config.allowInput === false &&
                    (e === undefined ||
                        !self.timeContainer.contains(e.relatedTarget))) {
                    setTimeout(() => self.hourElement.select(), 50);
                }
            }
        }
        function minMaxDateSetter(type) {
            return (date) => {
                const dateObj = (self.config[`_${type}Date`] = self.parseDate(date, self.config.dateFormat));
                const inverseDateObj = self.config[`_${type === "min" ? "max" : "min"}Date`];
                if (dateObj !== undefined) {
                    self[type === "min" ? "minDateHasTime" : "maxDateHasTime"] =
                        dateObj.getHours() > 0 ||
                            dateObj.getMinutes() > 0 ||
                            dateObj.getSeconds() > 0;
                }
                if (self.selectedDates) {
                    self.selectedDates = self.selectedDates.filter((d) => isEnabled(d));
                    if (!self.selectedDates.length && type === "min")
                        setHoursFromDate(dateObj);
                    updateValue();
                }
                if (self.daysContainer) {
                    redraw();
                    if (dateObj !== undefined)
                        self.currentYearElement[type] = dateObj.getFullYear().toString();
                    else
                        self.currentYearElement.removeAttribute(type);
                    self.currentYearElement.disabled =
                        !!inverseDateObj &&
                            dateObj !== undefined &&
                            inverseDateObj.getFullYear() === dateObj.getFullYear();
                }
            };
        }
        function parseConfig() {
            const boolOpts = [
                "wrap",
                "weekNumbers",
                "allowInput",
                "allowInvalidPreload",
                "clickOpens",
                "time_24hr",
                "enableTime",
                "noCalendar",
                "altInput",
                "shorthandCurrentMonth",
                "inline",
                "static",
                "enableSeconds",
                "disableMobile",
            ];
            const userConfig = Object.assign(Object.assign({}, JSON.parse(JSON.stringify(element.dataset || {}))), instanceConfig);
            const formats = {};
            self.config.parseDate = userConfig.parseDate;
            self.config.formatDate = userConfig.formatDate;
            Object.defineProperty(self.config, "enable", {
                get: () => self.config._enable,
                set: (dates) => {
                    self.config._enable = parseDateRules(dates);
                },
            });
            Object.defineProperty(self.config, "disable", {
                get: () => self.config._disable,
                set: (dates) => {
                    self.config._disable = parseDateRules(dates);
                },
            });
            const timeMode = userConfig.mode === "time";
            if (!userConfig.dateFormat && (userConfig.enableTime || timeMode)) {
                const defaultDateFormat = flatpickr.defaultConfig.dateFormat || defaults.dateFormat;
                formats.dateFormat =
                    userConfig.noCalendar || timeMode
                        ? "H:i" + (userConfig.enableSeconds ? ":S" : "")
                        : defaultDateFormat + " H:i" + (userConfig.enableSeconds ? ":S" : "");
            }
            if (userConfig.altInput &&
                (userConfig.enableTime || timeMode) &&
                !userConfig.altFormat) {
                const defaultAltFormat = flatpickr.defaultConfig.altFormat || defaults.altFormat;
                formats.altFormat =
                    userConfig.noCalendar || timeMode
                        ? "h:i" + (userConfig.enableSeconds ? ":S K" : " K")
                        : defaultAltFormat + ` h:i${userConfig.enableSeconds ? ":S" : ""} K`;
            }
            Object.defineProperty(self.config, "minDate", {
                get: () => self.config._minDate,
                set: minMaxDateSetter("min"),
            });
            Object.defineProperty(self.config, "maxDate", {
                get: () => self.config._maxDate,
                set: minMaxDateSetter("max"),
            });
            const minMaxTimeSetter = (type) => (val) => {
                self.config[type === "min" ? "_minTime" : "_maxTime"] = self.parseDate(val, "H:i:S");
            };
            Object.defineProperty(self.config, "minTime", {
                get: () => self.config._minTime,
                set: minMaxTimeSetter("min"),
            });
            Object.defineProperty(self.config, "maxTime", {
                get: () => self.config._maxTime,
                set: minMaxTimeSetter("max"),
            });
            if (userConfig.mode === "time") {
                self.config.noCalendar = true;
                self.config.enableTime = true;
            }
            Object.assign(self.config, formats, userConfig);
            for (let i = 0; i < boolOpts.length; i++)
                self.config[boolOpts[i]] =
                    self.config[boolOpts[i]] === true ||
                        self.config[boolOpts[i]] === "true";
            HOOKS.filter((hook) => self.config[hook] !== undefined).forEach((hook) => {
                self.config[hook] = arrayify(self.config[hook] || []).map(bindToInstance);
            });
            self.isMobile =
                !self.config.disableMobile &&
                    !self.config.inline &&
                    self.config.mode === "single" &&
                    !self.config.disable.length &&
                    !self.config.enable &&
                    !self.config.weekNumbers &&
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            for (let i = 0; i < self.config.plugins.length; i++) {
                const pluginConf = self.config.plugins[i](self) || {};
                for (const key in pluginConf) {
                    if (HOOKS.indexOf(key) > -1) {
                        self.config[key] = arrayify(pluginConf[key])
                            .map(bindToInstance)
                            .concat(self.config[key]);
                    }
                    else if (typeof userConfig[key] === "undefined")
                        self.config[key] = pluginConf[key];
                }
            }
            if (!userConfig.altInputClass) {
                self.config.altInputClass =
                    getInputElem().className + " " + self.config.altInputClass;
            }
            triggerEvent("onParseConfig");
        }
        function getInputElem() {
            return self.config.wrap
                ? element.querySelector("[data-input]")
                : element;
        }
        function setupLocale() {
            if (typeof self.config.locale !== "object" &&
                typeof flatpickr.l10ns[self.config.locale] === "undefined")
                self.config.errorHandler(new Error(`flatpickr: invalid locale ${self.config.locale}`));
            self.l10n = Object.assign(Object.assign({}, flatpickr.l10ns.default), (typeof self.config.locale === "object"
                ? self.config.locale
                : self.config.locale !== "default"
                    ? flatpickr.l10ns[self.config.locale]
                    : undefined));
            tokenRegex.K = `(${self.l10n.amPM[0]}|${self.l10n.amPM[1]}|${self.l10n.amPM[0].toLowerCase()}|${self.l10n.amPM[1].toLowerCase()})`;
            const userConfig = Object.assign(Object.assign({}, instanceConfig), JSON.parse(JSON.stringify(element.dataset || {})));
            if (userConfig.time_24hr === undefined &&
                flatpickr.defaultConfig.time_24hr === undefined) {
                self.config.time_24hr = self.l10n.time_24hr;
            }
            self.formatDate = createDateFormatter(self);
            self.parseDate = createDateParser({ config: self.config, l10n: self.l10n });
        }
        function positionCalendar(customPositionElement) {
            if (typeof self.config.position === "function") {
                return void self.config.position(self, customPositionElement);
            }
            if (self.calendarContainer === undefined)
                return;
            triggerEvent("onPreCalendarPosition");
            const positionElement = customPositionElement || self._positionElement;
            const calendarHeight = Array.prototype.reduce.call(self.calendarContainer.children, ((acc, child) => acc + child.offsetHeight), 0), calendarWidth = self.calendarContainer.offsetWidth, configPos = self.config.position.split(" "), configPosVertical = configPos[0], configPosHorizontal = configPos.length > 1 ? configPos[1] : null, inputBounds = positionElement.getBoundingClientRect(), distanceFromBottom = window.innerHeight - inputBounds.bottom, showOnTop = configPosVertical === "above" ||
                (configPosVertical !== "below" &&
                    distanceFromBottom < calendarHeight &&
                    inputBounds.top > calendarHeight);
            const top = window.pageYOffset +
                inputBounds.top +
                (!showOnTop ? positionElement.offsetHeight + 2 : -calendarHeight - 2);
            toggleClass(self.calendarContainer, "arrowTop", !showOnTop);
            toggleClass(self.calendarContainer, "arrowBottom", showOnTop);
            if (self.config.inline)
                return;
            let left = window.pageXOffset + inputBounds.left;
            let isCenter = false;
            let isRight = false;
            if (configPosHorizontal === "center") {
                left -= (calendarWidth - inputBounds.width) / 2;
                isCenter = true;
            }
            else if (configPosHorizontal === "right") {
                left -= calendarWidth - inputBounds.width;
                isRight = true;
            }
            toggleClass(self.calendarContainer, "arrowLeft", !isCenter && !isRight);
            toggleClass(self.calendarContainer, "arrowCenter", isCenter);
            toggleClass(self.calendarContainer, "arrowRight", isRight);
            const right = window.document.body.offsetWidth -
                (window.pageXOffset + inputBounds.right);
            const rightMost = left + calendarWidth > window.document.body.offsetWidth;
            const centerMost = right + calendarWidth > window.document.body.offsetWidth;
            toggleClass(self.calendarContainer, "rightMost", rightMost);
            if (self.config.static)
                return;
            self.calendarContainer.style.top = `${top}px`;
            if (!rightMost) {
                self.calendarContainer.style.left = `${left}px`;
                self.calendarContainer.style.right = "auto";
            }
            else if (!centerMost) {
                self.calendarContainer.style.left = "auto";
                self.calendarContainer.style.right = `${right}px`;
            }
            else {
                const doc = getDocumentStyleSheet();
                if (doc === undefined)
                    return;
                const bodyWidth = window.document.body.offsetWidth;
                const centerLeft = Math.max(0, bodyWidth / 2 - calendarWidth / 2);
                const centerBefore = ".flatpickr-calendar.centerMost:before";
                const centerAfter = ".flatpickr-calendar.centerMost:after";
                const centerIndex = doc.cssRules.length;
                const centerStyle = `{left:${inputBounds.left}px;right:auto;}`;
                toggleClass(self.calendarContainer, "rightMost", false);
                toggleClass(self.calendarContainer, "centerMost", true);
                doc.insertRule(`${centerBefore},${centerAfter}${centerStyle}`, centerIndex);
                self.calendarContainer.style.left = `${centerLeft}px`;
                self.calendarContainer.style.right = "auto";
            }
        }
        function getDocumentStyleSheet() {
            let editableSheet = null;
            for (let i = 0; i < document.styleSheets.length; i++) {
                const sheet = document.styleSheets[i];
                try {
                    sheet.cssRules;
                }
                catch (err) {
                    continue;
                }
                editableSheet = sheet;
                break;
            }
            return editableSheet != null ? editableSheet : createStyleSheet();
        }
        function createStyleSheet() {
            const style = document.createElement("style");
            document.head.appendChild(style);
            return style.sheet;
        }
        function redraw() {
            if (self.config.noCalendar || self.isMobile)
                return;
            buildMonthSwitch();
            updateNavigationCurrentMonth();
            buildDays();
        }
        function focusAndClose() {
            self._input.focus();
            if (window.navigator.userAgent.indexOf("MSIE") !== -1 ||
                navigator.msMaxTouchPoints !== undefined) {
                setTimeout(self.close, 0);
            }
            else {
                self.close();
            }
        }
        function selectDate(e) {
            e.preventDefault();
            e.stopPropagation();
            const isSelectable = (day) => day.classList &&
                day.classList.contains("flatpickr-day") &&
                !day.classList.contains("flatpickr-disabled") &&
                !day.classList.contains("notAllowed");
            const t = findParent(getEventTarget(e), isSelectable);
            if (t === undefined)
                return;
            const target = t;
            const selectedDate = (self.latestSelectedDateObj = new Date(target.dateObj.getTime()));
            const shouldChangeMonth = (selectedDate.getMonth() < self.currentMonth ||
                selectedDate.getMonth() >
                    self.currentMonth + self.config.showMonths - 1) &&
                self.config.mode !== "range";
            self.selectedDateElem = target;
            if (self.config.mode === "single")
                self.selectedDates = [selectedDate];
            else if (self.config.mode === "multiple") {
                const selectedIndex = isDateSelected(selectedDate);
                if (selectedIndex)
                    self.selectedDates.splice(parseInt(selectedIndex), 1);
                else
                    self.selectedDates.push(selectedDate);
            }
            else if (self.config.mode === "range") {
                if (self.selectedDates.length === 2) {
                    self.clear(false, false);
                }
                self.latestSelectedDateObj = selectedDate;
                self.selectedDates.push(selectedDate);
                if (compareDates(selectedDate, self.selectedDates[0], true) !== 0)
                    self.selectedDates.sort((a, b) => a.getTime() - b.getTime());
            }
            setHoursFromInputs();
            if (shouldChangeMonth) {
                const isNewYear = self.currentYear !== selectedDate.getFullYear();
                self.currentYear = selectedDate.getFullYear();
                self.currentMonth = selectedDate.getMonth();
                if (isNewYear) {
                    triggerEvent("onYearChange");
                    buildMonthSwitch();
                }
                triggerEvent("onMonthChange");
            }
            updateNavigationCurrentMonth();
            buildDays();
            updateValue();
            if (!shouldChangeMonth &&
                self.config.mode !== "range" &&
                self.config.showMonths === 1)
                focusOnDayElem(target);
            else if (self.selectedDateElem !== undefined &&
                self.hourElement === undefined) {
                self.selectedDateElem && self.selectedDateElem.focus();
            }
            if (self.hourElement !== undefined)
                self.hourElement !== undefined && self.hourElement.focus();
            if (self.config.closeOnSelect) {
                const single = self.config.mode === "single" && !self.config.enableTime;
                const range = self.config.mode === "range" &&
                    self.selectedDates.length === 2 &&
                    !self.config.enableTime;
                if (single || range) {
                    focusAndClose();
                }
            }
            triggerChange();
        }
        const CALLBACKS = {
            locale: [setupLocale, updateWeekdays],
            showMonths: [buildMonths, setCalendarWidth, buildWeekdays],
            minDate: [jumpToDate],
            maxDate: [jumpToDate],
            clickOpens: [
                () => {
                    if (self.config.clickOpens === true) {
                        bind(self._input, "focus", self.open);
                        bind(self._input, "click", self.open);
                    }
                    else {
                        self._input.removeEventListener("focus", self.open);
                        self._input.removeEventListener("click", self.open);
                    }
                },
            ],
        };
        function set(option, value) {
            if (option !== null && typeof option === "object") {
                Object.assign(self.config, option);
                for (const key in option) {
                    if (CALLBACKS[key] !== undefined)
                        CALLBACKS[key].forEach((x) => x());
                }
            }
            else {
                self.config[option] = value;
                if (CALLBACKS[option] !== undefined)
                    CALLBACKS[option].forEach((x) => x());
                else if (HOOKS.indexOf(option) > -1)
                    self.config[option] = arrayify(value);
            }
            self.redraw();
            updateValue(true);
        }
        function setSelectedDate(inputDate, format) {
            let dates = [];
            if (inputDate instanceof Array)
                dates = inputDate.map((d) => self.parseDate(d, format));
            else if (inputDate instanceof Date || typeof inputDate === "number")
                dates = [self.parseDate(inputDate, format)];
            else if (typeof inputDate === "string") {
                switch (self.config.mode) {
                    case "single":
                    case "time":
                        dates = [self.parseDate(inputDate, format)];
                        break;
                    case "multiple":
                        dates = inputDate
                            .split(self.config.conjunction)
                            .map((date) => self.parseDate(date, format));
                        break;
                    case "range":
                        dates = inputDate
                            .split(self.l10n.rangeSeparator)
                            .map((date) => self.parseDate(date, format));
                        break;
                }
            }
            else
                self.config.errorHandler(new Error(`Invalid date supplied: ${JSON.stringify(inputDate)}`));
            self.selectedDates = (self.config.allowInvalidPreload
                ? dates
                : dates.filter((d) => d instanceof Date && isEnabled(d, false)));
            if (self.config.mode === "range")
                self.selectedDates.sort((a, b) => a.getTime() - b.getTime());
        }
        function setDate(date, triggerChange = false, format = self.config.dateFormat) {
            if ((date !== 0 && !date) || (date instanceof Array && date.length === 0))
                return self.clear(triggerChange);
            setSelectedDate(date, format);
            self.latestSelectedDateObj =
                self.selectedDates[self.selectedDates.length - 1];
            self.redraw();
            jumpToDate(undefined, triggerChange);
            setHoursFromDate();
            if (self.selectedDates.length === 0) {
                self.clear(false);
            }
            updateValue(triggerChange);
            if (triggerChange)
                triggerEvent("onChange");
        }
        function parseDateRules(arr) {
            return arr
                .slice()
                .map((rule) => {
                if (typeof rule === "string" ||
                    typeof rule === "number" ||
                    rule instanceof Date) {
                    return self.parseDate(rule, undefined, true);
                }
                else if (rule &&
                    typeof rule === "object" &&
                    rule.from &&
                    rule.to)
                    return {
                        from: self.parseDate(rule.from, undefined),
                        to: self.parseDate(rule.to, undefined),
                    };
                return rule;
            })
                .filter((x) => x);
        }
        function setupDates() {
            self.selectedDates = [];
            self.now = self.parseDate(self.config.now) || new Date();
            const preloadedDate = self.config.defaultDate ||
                ((self.input.nodeName === "INPUT" ||
                    self.input.nodeName === "TEXTAREA") &&
                    self.input.placeholder &&
                    self.input.value === self.input.placeholder
                    ? null
                    : self.input.value);
            if (preloadedDate)
                setSelectedDate(preloadedDate, self.config.dateFormat);
            self._initialDate =
                self.selectedDates.length > 0
                    ? self.selectedDates[0]
                    : self.config.minDate &&
                        self.config.minDate.getTime() > self.now.getTime()
                        ? self.config.minDate
                        : self.config.maxDate &&
                            self.config.maxDate.getTime() < self.now.getTime()
                            ? self.config.maxDate
                            : self.now;
            self.currentYear = self._initialDate.getFullYear();
            self.currentMonth = self._initialDate.getMonth();
            if (self.selectedDates.length > 0)
                self.latestSelectedDateObj = self.selectedDates[0];
            if (self.config.minTime !== undefined)
                self.config.minTime = self.parseDate(self.config.minTime, "H:i");
            if (self.config.maxTime !== undefined)
                self.config.maxTime = self.parseDate(self.config.maxTime, "H:i");
            self.minDateHasTime =
                !!self.config.minDate &&
                    (self.config.minDate.getHours() > 0 ||
                        self.config.minDate.getMinutes() > 0 ||
                        self.config.minDate.getSeconds() > 0);
            self.maxDateHasTime =
                !!self.config.maxDate &&
                    (self.config.maxDate.getHours() > 0 ||
                        self.config.maxDate.getMinutes() > 0 ||
                        self.config.maxDate.getSeconds() > 0);
        }
        function setupInputs() {
            self.input = getInputElem();
            if (!self.input) {
                self.config.errorHandler(new Error("Invalid input element specified"));
                return;
            }
            self.input._type = self.input.type;
            self.input.type = "text";
            self.input.classList.add("flatpickr-input");
            self._input = self.input;
            if (self.config.altInput) {
                self.altInput = createElement(self.input.nodeName, self.config.altInputClass);
                self._input = self.altInput;
                self.altInput.placeholder = self.input.placeholder;
                self.altInput.disabled = self.input.disabled;
                self.altInput.required = self.input.required;
                self.altInput.tabIndex = self.input.tabIndex;
                self.altInput.type = "text";
                self.input.setAttribute("type", "hidden");
                if (!self.config.static && self.input.parentNode)
                    self.input.parentNode.insertBefore(self.altInput, self.input.nextSibling);
            }
            if (!self.config.allowInput)
                self._input.setAttribute("readonly", "readonly");
            self._positionElement = self.config.positionElement || self._input;
        }
        function setupMobile() {
            const inputType = self.config.enableTime
                ? self.config.noCalendar
                    ? "time"
                    : "datetime-local"
                : "date";
            self.mobileInput = createElement("input", self.input.className + " flatpickr-mobile");
            self.mobileInput.tabIndex = 1;
            self.mobileInput.type = inputType;
            self.mobileInput.disabled = self.input.disabled;
            self.mobileInput.required = self.input.required;
            self.mobileInput.placeholder = self.input.placeholder;
            self.mobileFormatStr =
                inputType === "datetime-local"
                    ? "Y-m-d\\TH:i:S"
                    : inputType === "date"
                        ? "Y-m-d"
                        : "H:i:S";
            if (self.selectedDates.length > 0) {
                self.mobileInput.defaultValue = self.mobileInput.value = self.formatDate(self.selectedDates[0], self.mobileFormatStr);
            }
            if (self.config.minDate)
                self.mobileInput.min = self.formatDate(self.config.minDate, "Y-m-d");
            if (self.config.maxDate)
                self.mobileInput.max = self.formatDate(self.config.maxDate, "Y-m-d");
            if (self.input.getAttribute("step"))
                self.mobileInput.step = String(self.input.getAttribute("step"));
            self.input.type = "hidden";
            if (self.altInput !== undefined)
                self.altInput.type = "hidden";
            try {
                if (self.input.parentNode)
                    self.input.parentNode.insertBefore(self.mobileInput, self.input.nextSibling);
            }
            catch (_a) { }
            bind(self.mobileInput, "change", (e) => {
                self.setDate(getEventTarget(e).value, false, self.mobileFormatStr);
                triggerEvent("onChange");
                triggerEvent("onClose");
            });
        }
        function toggle(e) {
            if (self.isOpen === true)
                return self.close();
            self.open(e);
        }
        function triggerEvent(event, data) {
            if (self.config === undefined)
                return;
            const hooks = self.config[event];
            if (hooks !== undefined && hooks.length > 0) {
                for (let i = 0; hooks[i] && i < hooks.length; i++)
                    hooks[i](self.selectedDates, self.input.value, self, data);
            }
            if (event === "onChange") {
                self.input.dispatchEvent(createEvent("change"));
                self.input.dispatchEvent(createEvent("input"));
            }
        }
        function createEvent(name) {
            const e = document.createEvent("Event");
            e.initEvent(name, true, true);
            return e;
        }
        function isDateSelected(date) {
            for (let i = 0; i < self.selectedDates.length; i++) {
                if (compareDates(self.selectedDates[i], date) === 0)
                    return "" + i;
            }
            return false;
        }
        function isDateInRange(date) {
            if (self.config.mode !== "range" || self.selectedDates.length < 2)
                return false;
            return (compareDates(date, self.selectedDates[0]) >= 0 &&
                compareDates(date, self.selectedDates[1]) <= 0);
        }
        function updateNavigationCurrentMonth() {
            if (self.config.noCalendar || self.isMobile || !self.monthNav)
                return;
            self.yearElements.forEach((yearElement, i) => {
                const d = new Date(self.currentYear, self.currentMonth, 1);
                d.setMonth(self.currentMonth + i);
                if (self.config.showMonths > 1 ||
                    self.config.monthSelectorType === "static") {
                    self.monthElements[i].textContent =
                        monthToStr(d.getMonth(), self.config.shorthandCurrentMonth, self.l10n) + " ";
                }
                else {
                    self.monthsDropdownContainer.value = d.getMonth().toString();
                }
                yearElement.value = d.getFullYear().toString();
            });
            self._hidePrevMonthArrow =
                self.config.minDate !== undefined &&
                    (self.currentYear === self.config.minDate.getFullYear()
                        ? self.currentMonth <= self.config.minDate.getMonth()
                        : self.currentYear < self.config.minDate.getFullYear());
            self._hideNextMonthArrow =
                self.config.maxDate !== undefined &&
                    (self.currentYear === self.config.maxDate.getFullYear()
                        ? self.currentMonth + 1 > self.config.maxDate.getMonth()
                        : self.currentYear > self.config.maxDate.getFullYear());
        }
        function getDateStr(format) {
            return self.selectedDates
                .map((dObj) => self.formatDate(dObj, format))
                .filter((d, i, arr) => self.config.mode !== "range" ||
                self.config.enableTime ||
                arr.indexOf(d) === i)
                .join(self.config.mode !== "range"
                ? self.config.conjunction
                : self.l10n.rangeSeparator);
        }
        function updateValue(triggerChange = true) {
            if (self.mobileInput !== undefined && self.mobileFormatStr) {
                self.mobileInput.value =
                    self.latestSelectedDateObj !== undefined
                        ? self.formatDate(self.latestSelectedDateObj, self.mobileFormatStr)
                        : "";
            }
            self.input.value = getDateStr(self.config.dateFormat);
            if (self.altInput !== undefined) {
                self.altInput.value = getDateStr(self.config.altFormat);
            }
            if (triggerChange !== false)
                triggerEvent("onValueUpdate");
        }
        function onMonthNavClick(e) {
            const eventTarget = getEventTarget(e);
            const isPrevMonth = self.prevMonthNav.contains(eventTarget);
            const isNextMonth = self.nextMonthNav.contains(eventTarget);
            if (isPrevMonth || isNextMonth) {
                changeMonth(isPrevMonth ? -1 : 1);
            }
            else if (self.yearElements.indexOf(eventTarget) >= 0) {
                eventTarget.select();
            }
            else if (eventTarget.classList.contains("arrowUp")) {
                self.changeYear(self.currentYear + 1);
            }
            else if (eventTarget.classList.contains("arrowDown")) {
                self.changeYear(self.currentYear - 1);
            }
        }
        function timeWrapper(e) {
            e.preventDefault();
            const isKeyDown = e.type === "keydown", eventTarget = getEventTarget(e), input = eventTarget;
            if (self.amPM !== undefined && eventTarget === self.amPM) {
                self.amPM.textContent =
                    self.l10n.amPM[int(self.amPM.textContent === self.l10n.amPM[0])];
            }
            const min = parseFloat(input.getAttribute("min")), max = parseFloat(input.getAttribute("max")), step = parseFloat(input.getAttribute("step")), curValue = parseInt(input.value, 10), delta = e.delta ||
                (isKeyDown ? (e.which === 38 ? 1 : -1) : 0);
            let newValue = curValue + step * delta;
            if (typeof input.value !== "undefined" && input.value.length === 2) {
                const isHourElem = input === self.hourElement, isMinuteElem = input === self.minuteElement;
                if (newValue < min) {
                    newValue =
                        max +
                            newValue +
                            int(!isHourElem) +
                            (int(isHourElem) && int(!self.amPM));
                    if (isMinuteElem)
                        incrementNumInput(undefined, -1, self.hourElement);
                }
                else if (newValue > max) {
                    newValue =
                        input === self.hourElement ? newValue - max - int(!self.amPM) : min;
                    if (isMinuteElem)
                        incrementNumInput(undefined, 1, self.hourElement);
                }
                if (self.amPM &&
                    isHourElem &&
                    (step === 1
                        ? newValue + curValue === 23
                        : Math.abs(newValue - curValue) > step)) {
                    self.amPM.textContent =
                        self.l10n.amPM[int(self.amPM.textContent === self.l10n.amPM[0])];
                }
                input.value = pad(newValue);
            }
        }
        init();
        return self;
    }
    function _flatpickr(nodeList, config) {
        const nodes = Array.prototype.slice
            .call(nodeList)
            .filter((x) => x instanceof HTMLElement);
        const instances = [];
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            try {
                if (node.getAttribute("data-fp-omit") !== null)
                    continue;
                if (node._flatpickr !== undefined) {
                    node._flatpickr.destroy();
                    node._flatpickr = undefined;
                }
                node._flatpickr = FlatpickrInstance(node, config || {});
                instances.push(node._flatpickr);
            }
            catch (e) {
                console.error(e);
            }
        }
        return instances.length === 1 ? instances[0] : instances;
    }
    if (typeof HTMLElement !== "undefined" &&
        typeof HTMLCollection !== "undefined" &&
        typeof NodeList !== "undefined") {
        HTMLCollection.prototype.flatpickr = NodeList.prototype.flatpickr = function (config) {
            return _flatpickr(this, config);
        };
        HTMLElement.prototype.flatpickr = function (config) {
            return _flatpickr([this], config);
        };
    }
    var flatpickr = function (selector, config) {
        if (typeof selector === "string") {
            return _flatpickr(window.document.querySelectorAll(selector), config);
        }
        else if (selector instanceof Node) {
            return _flatpickr([selector], config);
        }
        else {
            return _flatpickr(selector, config);
        }
    };
    flatpickr.defaultConfig = {};
    flatpickr.l10ns = {
        en: Object.assign({}, english),
        default: Object.assign({}, english),
    };
    flatpickr.localize = (l10n) => {
        flatpickr.l10ns.default = Object.assign(Object.assign({}, flatpickr.l10ns.default), l10n);
    };
    flatpickr.setDefaults = (config) => {
        flatpickr.defaultConfig = Object.assign(Object.assign({}, flatpickr.defaultConfig), config);
    };
    flatpickr.parseDate = createDateParser({});
    flatpickr.formatDate = createDateFormatter({});
    flatpickr.compareDates = compareDates;
    if (typeof jQuery !== "undefined" && typeof jQuery.fn !== "undefined") {
        jQuery.fn.flatpickr = function (config) {
            return _flatpickr(this, config);
        };
    }
    Date.prototype.fp_incr = function (days) {
        return new Date(this.getFullYear(), this.getMonth(), this.getDate() + (typeof days === "string" ? parseInt(days, 10) : days));
    };
    if (typeof window !== "undefined") {
        window.flatpickr = flatpickr;
    }

    let l10n;

    function updateClasses(instance) {
      const {
        calendarContainer,
        days,
        daysContainer,
        weekdayContainer,
        selectedDates,
      } = instance;

      calendarContainer.classList.add("bx--date-picker__calendar");
      calendarContainer
        .querySelector(".flatpickr-month")
        .classList.add("bx--date-picker__month");

      weekdayContainer.classList.add("bx--date-picker__weekdays");
      weekdayContainer.querySelectorAll(".flatpickr-weekday").forEach((node) => {
        node.classList.add("bx--date-picker__weekday");
      });

      daysContainer.classList.add("bx--date-picker__days");
      days.querySelectorAll(".flatpickr-day").forEach((node) => {
        node.classList.add("bx--date-picker__day");
        if (node.classList.contains("today") && selectedDates.length > 0) {
          node.classList.add("no-border");
        } else if (node.classList.contains("today") && selectedDates.length === 0) {
          node.classList.remove("no-border");
        }
      });
    }

    function updateMonthNode(instance) {
      const monthText = instance.l10n.months.longhand[instance.currentMonth];
      const staticMonthNode = instance.monthNav.querySelector(".cur-month");

      if (staticMonthNode) {
        staticMonthNode.textContent = monthText;
      } else {
        const monthSelectNode = instance.monthsDropdownContainer;
        const span = document.createElement("span");
        span.setAttribute("class", "cur-month");
        span.textContent = monthText;
        monthSelectNode.parentNode.replaceChild(span, monthSelectNode);
      }
    }

    async function createCalendar({ options, base, input, dispatch }) {
      let locale = options.locale;

      if (options.locale === "en" && l10n && l10n.en) {
        l10n.en.weekdays.shorthand.forEach((_, index) => {
          const shorthand = _.slice(0, 2);
          l10n.en.weekdays.shorthand[index] =
            shorthand === "Th" ? "Th" : shorthand.charAt(0);
        });

        locale = l10n.en;
      }

      let rangePlugin;

      if (options.mode === "range") {
        const importee = await Promise.resolve().then(function () { return rangePlugin$1; });
        rangePlugin = importee.default;
      }

      return new flatpickr(base, {
        allowInput: true,
        disableMobile: true,
        clickOpens: true,
        locale,
        plugins: [
          options.mode === "range" && new rangePlugin({ position: "left", input }),
        ].filter(Boolean),
        nextArrow:
          '<svg width="16px" height="16px" viewBox="0 0 16 16"><polygon points="11,8 6,13 5.3,12.3 9.6,8 5.3,3.7 6,3 "/><rect width="16" height="16" style="fill: none" /></svg>',
        prevArrow:
          '<svg width="16px" height="16px" viewBox="0 0 16 16"><polygon points="5,8 10,3 10.7,3.7 6.4,8 10.7,12.3 10,13 "/><rect width="16" height="16" style="fill: none" /></svg>',
        onChange: () => {
          dispatch("change");
        },
        onClose: () => {
          dispatch("close");
        },
        onMonthChange: (s, d, instance) => {
          updateMonthNode(instance);
        },
        onOpen: (s, d, instance) => {
          dispatch("open");
          updateClasses(instance);
          updateMonthNode(instance);
        },
        ...options,
      });
    }

    /* node_modules/carbon-components-svelte/src/DatePicker/DatePicker.svelte generated by Svelte v3.55.1 */
    const file$d = "node_modules/carbon-components-svelte/src/DatePicker/DatePicker.svelte";

    function create_fragment$e(ctx) {
    	let div1;
    	let div0;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[30].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[29], null);
    	let div1_levels = [/*$$restProps*/ ctx[15]];
    	let div1_data = {};

    	for (let i = 0; i < div1_levels.length; i += 1) {
    		div1_data = assign(div1_data, div1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "id", /*id*/ ctx[3]);
    			toggle_class(div0, "bx--date-picker", true);
    			toggle_class(div0, "bx--date-picker--short", /*short*/ ctx[1]);
    			toggle_class(div0, "bx--date-picker--light", /*light*/ ctx[2]);
    			toggle_class(div0, "bx--date-picker--simple", /*datePickerType*/ ctx[0] === 'simple');
    			toggle_class(div0, "bx--date-picker--single", /*datePickerType*/ ctx[0] === 'single');
    			toggle_class(div0, "bx--date-picker--range", /*datePickerType*/ ctx[0] === 'range');
    			toggle_class(div0, "bx--date-picker--nolabel", /*datePickerType*/ ctx[0] === 'range' && /*$labelTextEmpty*/ ctx[6]);
    			add_location(div0, file$d, 248, 2, 6128);
    			set_attributes(div1, div1_data);
    			toggle_class(div1, "bx--form-item", true);
    			add_location(div1, file$d, 240, 0, 6011);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div0_binding*/ ctx[36](div0);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "click", /*click_handler_1*/ ctx[35], false, false, false),
    					listen_dev(div0, "keydown", /*keydown_handler*/ ctx[37], false, false, false),
    					listen_dev(div1, "click", /*click_handler*/ ctx[31], false, false, false),
    					listen_dev(div1, "mouseover", /*mouseover_handler*/ ctx[32], false, false, false),
    					listen_dev(div1, "mouseenter", /*mouseenter_handler*/ ctx[33], false, false, false),
    					listen_dev(div1, "mouseleave", /*mouseleave_handler*/ ctx[34], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 536870912)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[29],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[29])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[29], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty[0] & /*id*/ 8) {
    				attr_dev(div0, "id", /*id*/ ctx[3]);
    			}

    			if (!current || dirty[0] & /*short*/ 2) {
    				toggle_class(div0, "bx--date-picker--short", /*short*/ ctx[1]);
    			}

    			if (!current || dirty[0] & /*light*/ 4) {
    				toggle_class(div0, "bx--date-picker--light", /*light*/ ctx[2]);
    			}

    			if (!current || dirty[0] & /*datePickerType*/ 1) {
    				toggle_class(div0, "bx--date-picker--simple", /*datePickerType*/ ctx[0] === 'simple');
    			}

    			if (!current || dirty[0] & /*datePickerType*/ 1) {
    				toggle_class(div0, "bx--date-picker--single", /*datePickerType*/ ctx[0] === 'single');
    			}

    			if (!current || dirty[0] & /*datePickerType*/ 1) {
    				toggle_class(div0, "bx--date-picker--range", /*datePickerType*/ ctx[0] === 'range');
    			}

    			if (!current || dirty[0] & /*datePickerType, $labelTextEmpty*/ 65) {
    				toggle_class(div0, "bx--date-picker--nolabel", /*datePickerType*/ ctx[0] === 'range' && /*$labelTextEmpty*/ ctx[6]);
    			}

    			set_attributes(div1, div1_data = get_spread_update(div1_levels, [dirty[0] & /*$$restProps*/ 32768 && /*$$restProps*/ ctx[15]]));
    			toggle_class(div1, "bx--form-item", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			/*div0_binding*/ ctx[36](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"datePickerType","value","valueFrom","valueTo","dateFormat","maxDate","minDate","locale","short","light","id","flatpickrProps"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $hasCalendar;
    	let $inputValueTo;
    	let $inputValueFrom;
    	let $inputValue;
    	let $range;
    	let $mode;
    	let $inputIds;
    	let $labelTextEmpty;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DatePicker', slots, ['default']);
    	let { datePickerType = "simple" } = $$props;
    	let { value = "" } = $$props;
    	let { valueFrom = "" } = $$props;
    	let { valueTo = "" } = $$props;
    	let { dateFormat = "m/d/Y" } = $$props;
    	let { maxDate = null } = $$props;
    	let { minDate = null } = $$props;
    	let { locale = "en" } = $$props;
    	let { short = false } = $$props;
    	let { light = false } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { flatpickrProps = { static: true } } = $$props;
    	const dispatch = createEventDispatcher();
    	const inputs = writable([]);
    	const inputIds = derived(inputs, _ => _.map(({ id }) => id));
    	validate_store(inputIds, 'inputIds');
    	component_subscribe($$self, inputIds, value => $$invalidate(41, $inputIds = value));
    	const labelTextEmpty = derived(inputs, _ => _.filter(({ labelText }) => !!labelText).length === 0);
    	validate_store(labelTextEmpty, 'labelTextEmpty');
    	component_subscribe($$self, labelTextEmpty, value => $$invalidate(6, $labelTextEmpty = value));
    	const inputValue = writable(value);
    	validate_store(inputValue, 'inputValue');
    	component_subscribe($$self, inputValue, value => $$invalidate(28, $inputValue = value));
    	const inputValueFrom = writable(valueFrom);
    	validate_store(inputValueFrom, 'inputValueFrom');
    	component_subscribe($$self, inputValueFrom, value => $$invalidate(27, $inputValueFrom = value));
    	const inputValueTo = writable(valueTo);
    	validate_store(inputValueTo, 'inputValueTo');
    	component_subscribe($$self, inputValueTo, value => $$invalidate(26, $inputValueTo = value));
    	const mode = writable(datePickerType);
    	validate_store(mode, 'mode');
    	component_subscribe($$self, mode, value => $$invalidate(40, $mode = value));
    	const range = derived(mode, _ => _ === "range");
    	validate_store(range, 'range');
    	component_subscribe($$self, range, value => $$invalidate(39, $range = value));
    	const hasCalendar = derived(mode, _ => _ === "single" || _ === "range");
    	validate_store(hasCalendar, 'hasCalendar');
    	component_subscribe($$self, hasCalendar, value => $$invalidate(25, $hasCalendar = value));
    	let calendar = null;
    	let datePickerRef = null;
    	let inputRef = null;
    	let inputRefTo = null;

    	setContext("DatePicker", {
    		range,
    		inputValue,
    		inputValueFrom,
    		inputValueTo,
    		inputIds,
    		hasCalendar,
    		add: data => {
    			inputs.update(_ => [..._, data]);
    		},
    		declareRef: ({ id, ref }) => {
    			if ($inputIds.indexOf(id) === 0) {
    				$$invalidate(24, inputRef = ref);
    			} else {
    				inputRefTo = ref;
    			}
    		},
    		updateValue: ({ type, value }) => {
    			if (!calendar && type === "input" || type === "change") {
    				inputValue.set(value);
    			}

    			if (!calendar && type === "change") {
    				dispatch("change", value);
    			}
    		},
    		blurInput: relatedTarget => {
    			if (calendar && !calendar.calendarContainer.contains(relatedTarget)) {
    				calendar.close();
    			}
    		},
    		openCalendar: () => {
    			calendar.open();
    		},
    		focusCalendar: () => {
    			(calendar.selectedDateElem || calendar.todayDateElem || calendar.calendarContainer.querySelector(".flatpickr-day[tabindex]") || calendar.calendarContainer).focus();
    		}
    	});

    	async function initCalendar(options) {
    		if (calendar) {
    			calendar.set("minDate", minDate);
    			calendar.set("maxDate", maxDate);
    			calendar.set("locale", locale);
    			calendar.set("dateFormat", dateFormat);

    			Object.entries(flatpickrProps).forEach(([option, value]) => {
    				calendar.set(options, value);
    			});

    			return;
    		}

    		$$invalidate(4, calendar = await createCalendar({
    			options: {
    				...options,
    				appendTo: datePickerRef,
    				defaultDate: $inputValue,
    				mode: $mode
    			},
    			base: inputRef,
    			input: inputRefTo,
    			dispatch: event => {
    				const detail = { selectedDates: calendar.selectedDates };

    				if ($range) {
    					const from = inputRef.value;
    					const to = inputRefTo.value;

    					detail.dateStr = {
    						from: inputRef.value,
    						to: inputRefTo.value
    					};

    					$$invalidate(17, valueFrom = from);
    					$$invalidate(18, valueTo = to);
    				} else {
    					detail.dateStr = inputRef.value;
    				}

    				return dispatch(event, detail);
    			}
    		}));

    		calendar?.calendarContainer?.setAttribute("role", "application");
    		calendar?.calendarContainer?.setAttribute("aria-label", "calendar-container");
    	}

    	onMount(() => {
    		return () => {
    			if (calendar) {
    				calendar.destroy();
    				$$invalidate(4, calendar = null);
    			}
    		};
    	});

    	afterUpdate(() => {
    		if (calendar) {
    			if ($range) {
    				calendar.setDate([$inputValueFrom, $inputValueTo]);

    				// workaround to remove the default range plugin separator "to"
    				$$invalidate(24, inputRef.value = $inputValueFrom, inputRef);
    			} else {
    				calendar.setDate($inputValue);
    			}
    		}
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler_1 = ({ target }) => {
    		if (!calendar || !calendar.isOpen) return;
    		if (datePickerRef && datePickerRef.contains(target)) return;
    		if (!calendar.calendarContainer.contains(target)) calendar.close();
    	};

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			datePickerRef = $$value;
    			$$invalidate(5, datePickerRef);
    		});
    	}

    	const keydown_handler = e => {
    		if (calendar?.isOpen && e.key === 'Escape') {
    			e.stopPropagation();
    			calendar.close();
    		}
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(15, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('datePickerType' in $$new_props) $$invalidate(0, datePickerType = $$new_props.datePickerType);
    		if ('value' in $$new_props) $$invalidate(16, value = $$new_props.value);
    		if ('valueFrom' in $$new_props) $$invalidate(17, valueFrom = $$new_props.valueFrom);
    		if ('valueTo' in $$new_props) $$invalidate(18, valueTo = $$new_props.valueTo);
    		if ('dateFormat' in $$new_props) $$invalidate(19, dateFormat = $$new_props.dateFormat);
    		if ('maxDate' in $$new_props) $$invalidate(20, maxDate = $$new_props.maxDate);
    		if ('minDate' in $$new_props) $$invalidate(21, minDate = $$new_props.minDate);
    		if ('locale' in $$new_props) $$invalidate(22, locale = $$new_props.locale);
    		if ('short' in $$new_props) $$invalidate(1, short = $$new_props.short);
    		if ('light' in $$new_props) $$invalidate(2, light = $$new_props.light);
    		if ('id' in $$new_props) $$invalidate(3, id = $$new_props.id);
    		if ('flatpickrProps' in $$new_props) $$invalidate(23, flatpickrProps = $$new_props.flatpickrProps);
    		if ('$$scope' in $$new_props) $$invalidate(29, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		datePickerType,
    		value,
    		valueFrom,
    		valueTo,
    		dateFormat,
    		maxDate,
    		minDate,
    		locale,
    		short,
    		light,
    		id,
    		flatpickrProps,
    		createEventDispatcher,
    		setContext,
    		afterUpdate,
    		onMount,
    		writable,
    		derived,
    		createCalendar,
    		dispatch,
    		inputs,
    		inputIds,
    		labelTextEmpty,
    		inputValue,
    		inputValueFrom,
    		inputValueTo,
    		mode,
    		range,
    		hasCalendar,
    		calendar,
    		datePickerRef,
    		inputRef,
    		inputRefTo,
    		initCalendar,
    		$hasCalendar,
    		$inputValueTo,
    		$inputValueFrom,
    		$inputValue,
    		$range,
    		$mode,
    		$inputIds,
    		$labelTextEmpty
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('datePickerType' in $$props) $$invalidate(0, datePickerType = $$new_props.datePickerType);
    		if ('value' in $$props) $$invalidate(16, value = $$new_props.value);
    		if ('valueFrom' in $$props) $$invalidate(17, valueFrom = $$new_props.valueFrom);
    		if ('valueTo' in $$props) $$invalidate(18, valueTo = $$new_props.valueTo);
    		if ('dateFormat' in $$props) $$invalidate(19, dateFormat = $$new_props.dateFormat);
    		if ('maxDate' in $$props) $$invalidate(20, maxDate = $$new_props.maxDate);
    		if ('minDate' in $$props) $$invalidate(21, minDate = $$new_props.minDate);
    		if ('locale' in $$props) $$invalidate(22, locale = $$new_props.locale);
    		if ('short' in $$props) $$invalidate(1, short = $$new_props.short);
    		if ('light' in $$props) $$invalidate(2, light = $$new_props.light);
    		if ('id' in $$props) $$invalidate(3, id = $$new_props.id);
    		if ('flatpickrProps' in $$props) $$invalidate(23, flatpickrProps = $$new_props.flatpickrProps);
    		if ('calendar' in $$props) $$invalidate(4, calendar = $$new_props.calendar);
    		if ('datePickerRef' in $$props) $$invalidate(5, datePickerRef = $$new_props.datePickerRef);
    		if ('inputRef' in $$props) $$invalidate(24, inputRef = $$new_props.inputRef);
    		if ('inputRefTo' in $$props) inputRefTo = $$new_props.inputRefTo;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*$inputValue*/ 268435456) {
    			$$invalidate(16, value = $inputValue);
    		}

    		if ($$self.$$.dirty[0] & /*value*/ 65536) {
    			inputValue.set(value);
    		}

    		if ($$self.$$.dirty[0] & /*$inputValueFrom*/ 134217728) {
    			$$invalidate(17, valueFrom = $inputValueFrom);
    		}

    		if ($$self.$$.dirty[0] & /*valueFrom*/ 131072) {
    			inputValueFrom.set(valueFrom);
    		}

    		if ($$self.$$.dirty[0] & /*$inputValueTo*/ 67108864) {
    			$$invalidate(18, valueTo = $inputValueTo);
    		}

    		if ($$self.$$.dirty[0] & /*valueTo*/ 262144) {
    			inputValueTo.set(valueTo);
    		}

    		if ($$self.$$.dirty[0] & /*$hasCalendar, inputRef, dateFormat, locale, maxDate, minDate, flatpickrProps*/ 66584576) {
    			if ($hasCalendar && inputRef) {
    				initCalendar({
    					dateFormat,
    					locale,
    					maxDate,
    					minDate,
    					// default to static: true so the
    					// date picker works inside a modal
    					static: true,
    					...flatpickrProps
    				});
    			}
    		}
    	};

    	return [
    		datePickerType,
    		short,
    		light,
    		id,
    		calendar,
    		datePickerRef,
    		$labelTextEmpty,
    		inputIds,
    		labelTextEmpty,
    		inputValue,
    		inputValueFrom,
    		inputValueTo,
    		mode,
    		range,
    		hasCalendar,
    		$$restProps,
    		value,
    		valueFrom,
    		valueTo,
    		dateFormat,
    		maxDate,
    		minDate,
    		locale,
    		flatpickrProps,
    		inputRef,
    		$hasCalendar,
    		$inputValueTo,
    		$inputValueFrom,
    		$inputValue,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		click_handler_1,
    		div0_binding,
    		keydown_handler
    	];
    }

    class DatePicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$e,
    			create_fragment$e,
    			safe_not_equal,
    			{
    				datePickerType: 0,
    				value: 16,
    				valueFrom: 17,
    				valueTo: 18,
    				dateFormat: 19,
    				maxDate: 20,
    				minDate: 21,
    				locale: 22,
    				short: 1,
    				light: 2,
    				id: 3,
    				flatpickrProps: 23
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DatePicker",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get datePickerType() {
    		throw new Error("<DatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set datePickerType(value) {
    		throw new Error("<DatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<DatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<DatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valueFrom() {
    		throw new Error("<DatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valueFrom(value) {
    		throw new Error("<DatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valueTo() {
    		throw new Error("<DatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valueTo(value) {
    		throw new Error("<DatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dateFormat() {
    		throw new Error("<DatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dateFormat(value) {
    		throw new Error("<DatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxDate() {
    		throw new Error("<DatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxDate(value) {
    		throw new Error("<DatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minDate() {
    		throw new Error("<DatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minDate(value) {
    		throw new Error("<DatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get locale() {
    		throw new Error("<DatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set locale(value) {
    		throw new Error("<DatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get short() {
    		throw new Error("<DatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set short(value) {
    		throw new Error("<DatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<DatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<DatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<DatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<DatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flatpickrProps() {
    		throw new Error("<DatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flatpickrProps(value) {
    		throw new Error("<DatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var DatePicker$1 = DatePicker;

    /* node_modules/carbon-components-svelte/src/icons/Calendar.svelte generated by Svelte v3.55.1 */

    const file$c = "node_modules/carbon-components-svelte/src/icons/Calendar.svelte";

    // (24:2) {#if title}
    function create_if_block$b(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$c, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let svg;
    	let path;
    	let if_block = /*title*/ ctx[1] && create_if_block$b(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path = svg_element("path");
    			attr_dev(path, "d", "M26,4h-4V2h-2v2h-8V2h-2v2H6C4.9,4,4,4.9,4,6v20c0,1.1,0.9,2,2,2h20c1.1,0,2-0.9,2-2V6C28,4.9,27.1,4,26,4z M26,26H6V12h20\tV26z M26,10H6V6h4v2h2V6h8v2h2V6h4V10z");
    			add_location(path, file$c, 24, 2, 579);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$c, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					if_block.m(svg, path);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Calendar', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class Calendar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Calendar",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get size() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Calendar$1 = Calendar;

    /* node_modules/carbon-components-svelte/src/DatePicker/DatePickerInput.svelte generated by Svelte v3.55.1 */
    const file$b = "node_modules/carbon-components-svelte/src/DatePicker/DatePickerInput.svelte";
    const get_labelText_slot_changes$1 = dirty => ({});
    const get_labelText_slot_context$1 = ctx => ({});

    // (85:2) {#if labelText || $$slots.labelText}
    function create_if_block_6$2(ctx) {
    	let label;
    	let current;
    	const labelText_slot_template = /*#slots*/ ctx[35].labelText;
    	const labelText_slot = create_slot(labelText_slot_template, ctx, /*$$scope*/ ctx[34], get_labelText_slot_context$1);
    	const labelText_slot_or_fallback = labelText_slot || fallback_block$4(ctx);

    	const block = {
    		c: function create() {
    			label = element("label");
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.c();
    			attr_dev(label, "for", /*id*/ ctx[8]);
    			toggle_class(label, "bx--label", true);
    			toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[10]);
    			toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[5]);
    			add_location(label, file$b, 85, 4, 1995);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);

    			if (labelText_slot_or_fallback) {
    				labelText_slot_or_fallback.m(label, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (labelText_slot) {
    				if (labelText_slot.p && (!current || dirty[1] & /*$$scope*/ 8)) {
    					update_slot_base(
    						labelText_slot,
    						labelText_slot_template,
    						ctx,
    						/*$$scope*/ ctx[34],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[34])
    						: get_slot_changes(labelText_slot_template, /*$$scope*/ ctx[34], dirty, get_labelText_slot_changes$1),
    						get_labelText_slot_context$1
    					);
    				}
    			} else {
    				if (labelText_slot_or_fallback && labelText_slot_or_fallback.p && (!current || dirty[0] & /*labelText*/ 512)) {
    					labelText_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*id*/ 256) {
    				attr_dev(label, "for", /*id*/ ctx[8]);
    			}

    			if (!current || dirty[0] & /*hideLabel*/ 1024) {
    				toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[10]);
    			}

    			if (!current || dirty[0] & /*disabled*/ 32) {
    				toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[5]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(labelText_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(labelText_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$2.name,
    		type: "if",
    		source: "(85:2) {#if labelText || $$slots.labelText}",
    		ctx
    	});

    	return block;
    }

    // (92:29)
    function fallback_block$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*labelText*/ ctx[9]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*labelText*/ 512) set_data_dev(t, /*labelText*/ ctx[9]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$4.name,
    		type: "fallback",
    		source: "(92:29)          ",
    		ctx
    	});

    	return block;
    }

    // (141:4) {#if invalid}
    function create_if_block_5$3(ctx) {
    	let warningfilled;
    	let current;

    	warningfilled = new WarningFilled$1({
    			props: {
    				class: "bx--date-picker__icon bx--date-picker__icon--invalid"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warningfilled.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(warningfilled, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warningfilled.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warningfilled.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warningfilled, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$3.name,
    		type: "if",
    		source: "(141:4) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (146:4) {#if !invalid && warn}
    function create_if_block_4$3(ctx) {
    	let warningaltfilled;
    	let current;

    	warningaltfilled = new WarningAltFilled$1({
    			props: {
    				class: "bx--date-picker__icon bx--date-picker__icon--warn"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warningaltfilled.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(warningaltfilled, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warningaltfilled.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warningaltfilled.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warningaltfilled, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$3.name,
    		type: "if",
    		source: "(146:4) {#if !invalid && warn}",
    		ctx
    	});

    	return block;
    }

    // (151:4) {#if $hasCalendar && !invalid && !warn}
    function create_if_block_3$3(ctx) {
    	let calendar;
    	let current;

    	calendar = new Calendar$1({
    			props: {
    				class: "bx--date-picker__icon",
    				"aria-label": /*iconDescription*/ ctx[7]
    			},
    			$$inline: true
    		});

    	calendar.$on("click", /*openCalendar*/ ctx[27]);

    	const block = {
    		c: function create() {
    			create_component(calendar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(calendar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const calendar_changes = {};
    			if (dirty[0] & /*iconDescription*/ 128) calendar_changes["aria-label"] = /*iconDescription*/ ctx[7];
    			calendar.$set(calendar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(calendar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(calendar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(calendar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(151:4) {#if $hasCalendar && !invalid && !warn}",
    		ctx
    	});

    	return block;
    }

    // (159:2) {#if invalid}
    function create_if_block_2$4(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*invalidText*/ ctx[12]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$b, 159, 4, 3988);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*invalidText*/ 4096) set_data_dev(t, /*invalidText*/ ctx[12]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(159:2) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (162:2) {#if !invalid && warn}
    function create_if_block_1$5(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*warnText*/ ctx[14]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$b, 162, 4, 4086);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*warnText*/ 16384) set_data_dev(t, /*warnText*/ ctx[14]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(162:2) {#if !invalid && warn}",
    		ctx
    	});

    	return block;
    }

    // (165:2) {#if helperText}
    function create_if_block$a(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*helperText*/ ctx[6]);
    			toggle_class(div, "bx--form__helper-text", true);
    			toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[5]);
    			add_location(div, file$b, 165, 4, 4175);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*helperText*/ 64) set_data_dev(t, /*helperText*/ ctx[6]);

    			if (dirty[0] & /*disabled*/ 32) {
    				toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[5]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(165:2) {#if helperText}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let input;
    	let input_data_invalid_value;
    	let input_value_value;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = (/*labelText*/ ctx[9] || /*$$slots*/ ctx[32].labelText) && create_if_block_6$2(ctx);

    	let input_levels = [
    		{
    			"data-invalid": input_data_invalid_value = /*invalid*/ ctx[11] || undefined
    		},
    		{ id: /*id*/ ctx[8] },
    		{ name: /*name*/ ctx[15] },
    		{ placeholder: /*placeholder*/ ctx[3] },
    		{ type: /*type*/ ctx[2] },
    		{ pattern: /*pattern*/ ctx[4] },
    		{ disabled: /*disabled*/ ctx[5] },
    		/*$$restProps*/ ctx[33],
    		{
    			value: input_value_value = /*$range*/ ctx[16]
    			? /*$inputIds*/ ctx[17].indexOf(/*id*/ ctx[8]) === 0
    				? /*$inputValueFrom*/ ctx[18]
    				: /*$inputValueTo*/ ctx[19]
    			: /*$inputValue*/ ctx[20]
    		}
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	let if_block1 = /*invalid*/ ctx[11] && create_if_block_5$3(ctx);
    	let if_block2 = !/*invalid*/ ctx[11] && /*warn*/ ctx[13] && create_if_block_4$3(ctx);
    	let if_block3 = /*$hasCalendar*/ ctx[21] && !/*invalid*/ ctx[11] && !/*warn*/ ctx[13] && create_if_block_3$3(ctx);
    	let if_block4 = /*invalid*/ ctx[11] && create_if_block_2$4(ctx);
    	let if_block5 = !/*invalid*/ ctx[11] && /*warn*/ ctx[13] && create_if_block_1$5(ctx);
    	let if_block6 = /*helperText*/ ctx[6] && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div0 = element("div");
    			input = element("input");
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			if (if_block3) if_block3.c();
    			t4 = space();
    			if (if_block4) if_block4.c();
    			t5 = space();
    			if (if_block5) if_block5.c();
    			t6 = space();
    			if (if_block6) if_block6.c();
    			set_attributes(input, input_data);
    			toggle_class(input, "bx--date-picker__input", true);
    			toggle_class(input, "bx--date-picker__input--invalid", /*invalid*/ ctx[11]);
    			toggle_class(input, "bx--date-picker__input--sm", /*size*/ ctx[1] === 'sm');
    			toggle_class(input, "bx--date-picker__input--xl", /*size*/ ctx[1] === 'xl');
    			add_location(input, file$b, 101, 4, 2415);
    			toggle_class(div0, "bx--date-picker-input__wrapper", true);
    			toggle_class(div0, "bx--date-picker-input__wrapper--invalid", /*invalid*/ ctx[11]);
    			toggle_class(div0, "bx--date-picker-input__wrapper--warn", /*warn*/ ctx[13]);
    			add_location(div0, file$b, 96, 2, 2234);
    			toggle_class(div1, "bx--date-picker-container", true);
    			toggle_class(div1, "bx--date-picker--nolabel", !/*labelText*/ ctx[9]);
    			add_location(div1, file$b, 80, 0, 1854);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, input);
    			input.value = input_data.value;
    			if (input.autofocus) input.focus();
    			/*input_binding*/ ctx[41](input);
    			append_dev(div0, t1);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t2);
    			if (if_block2) if_block2.m(div0, null);
    			append_dev(div0, t3);
    			if (if_block3) if_block3.m(div0, null);
    			append_dev(div1, t4);
    			if (if_block4) if_block4.m(div1, null);
    			append_dev(div1, t5);
    			if (if_block5) if_block5.m(div1, null);
    			append_dev(div1, t6);
    			if (if_block6) if_block6.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_handler*/ ctx[36], false, false, false),
    					listen_dev(input, "input", /*input_handler_1*/ ctx[42], false, false, false),
    					listen_dev(input, "change", /*change_handler*/ ctx[43], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler*/ ctx[37], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_1*/ ctx[44], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler*/ ctx[38], false, false, false),
    					listen_dev(input, "blur", /*blur_handler*/ ctx[39], false, false, false),
    					listen_dev(input, "blur", /*blur_handler_1*/ ctx[45], false, false, false),
    					listen_dev(input, "paste", /*paste_handler*/ ctx[40], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*labelText*/ ctx[9] || /*$$slots*/ ctx[32].labelText) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*labelText*/ 512 | dirty[1] & /*$$slots*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_6$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div1, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				(!current || dirty[0] & /*invalid*/ 2048 && input_data_invalid_value !== (input_data_invalid_value = /*invalid*/ ctx[11] || undefined)) && { "data-invalid": input_data_invalid_value },
    				(!current || dirty[0] & /*id*/ 256) && { id: /*id*/ ctx[8] },
    				(!current || dirty[0] & /*name*/ 32768) && { name: /*name*/ ctx[15] },
    				(!current || dirty[0] & /*placeholder*/ 8) && { placeholder: /*placeholder*/ ctx[3] },
    				(!current || dirty[0] & /*type*/ 4) && { type: /*type*/ ctx[2] },
    				(!current || dirty[0] & /*pattern*/ 16) && { pattern: /*pattern*/ ctx[4] },
    				(!current || dirty[0] & /*disabled*/ 32) && { disabled: /*disabled*/ ctx[5] },
    				dirty[1] & /*$$restProps*/ 4 && /*$$restProps*/ ctx[33],
    				(!current || dirty[0] & /*$range, $inputIds, id, $inputValueFrom, $inputValueTo, $inputValue*/ 2031872 && input_value_value !== (input_value_value = /*$range*/ ctx[16]
    				? /*$inputIds*/ ctx[17].indexOf(/*id*/ ctx[8]) === 0
    					? /*$inputValueFrom*/ ctx[18]
    					: /*$inputValueTo*/ ctx[19]
    				: /*$inputValue*/ ctx[20]) && input.value !== input_value_value) && { value: input_value_value }
    			]));

    			if ('value' in input_data) {
    				input.value = input_data.value;
    			}

    			toggle_class(input, "bx--date-picker__input", true);
    			toggle_class(input, "bx--date-picker__input--invalid", /*invalid*/ ctx[11]);
    			toggle_class(input, "bx--date-picker__input--sm", /*size*/ ctx[1] === 'sm');
    			toggle_class(input, "bx--date-picker__input--xl", /*size*/ ctx[1] === 'xl');

    			if (/*invalid*/ ctx[11]) {
    				if (if_block1) {
    					if (dirty[0] & /*invalid*/ 2048) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_5$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div0, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!/*invalid*/ ctx[11] && /*warn*/ ctx[13]) {
    				if (if_block2) {
    					if (dirty[0] & /*invalid, warn*/ 10240) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_4$3(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div0, t3);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*$hasCalendar*/ ctx[21] && !/*invalid*/ ctx[11] && !/*warn*/ ctx[13]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty[0] & /*$hasCalendar, invalid, warn*/ 2107392) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_3$3(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div0, null);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*invalid*/ 2048) {
    				toggle_class(div0, "bx--date-picker-input__wrapper--invalid", /*invalid*/ ctx[11]);
    			}

    			if (!current || dirty[0] & /*warn*/ 8192) {
    				toggle_class(div0, "bx--date-picker-input__wrapper--warn", /*warn*/ ctx[13]);
    			}

    			if (/*invalid*/ ctx[11]) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_2$4(ctx);
    					if_block4.c();
    					if_block4.m(div1, t5);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (!/*invalid*/ ctx[11] && /*warn*/ ctx[13]) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_1$5(ctx);
    					if_block5.c();
    					if_block5.m(div1, t6);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*helperText*/ ctx[6]) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block$a(ctx);
    					if_block6.c();
    					if_block6.m(div1, null);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (!current || dirty[0] & /*labelText*/ 512) {
    				toggle_class(div1, "bx--date-picker--nolabel", !/*labelText*/ ctx[9]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			/*input_binding*/ ctx[41](null);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"size","type","placeholder","pattern","disabled","helperText","iconDescription","id","labelText","hideLabel","invalid","invalidText","warn","warnText","name","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $range;
    	let $inputIds;
    	let $inputValueFrom;
    	let $inputValueTo;
    	let $inputValue;
    	let $hasCalendar;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DatePickerInput', slots, ['labelText']);
    	const $$slots = compute_slots(slots);
    	let { size = undefined } = $$props;
    	let { type = "text" } = $$props;
    	let { placeholder = "" } = $$props;
    	let { pattern = "\\d{1,2}\\/\\d{1,2}\\/\\d{4}" } = $$props;
    	let { disabled = false } = $$props;
    	let { helperText = "" } = $$props;
    	let { iconDescription = "" } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { labelText = "" } = $$props;
    	let { hideLabel = false } = $$props;
    	let { invalid = false } = $$props;
    	let { invalidText = "" } = $$props;
    	let { warn = false } = $$props;
    	let { warnText = "" } = $$props;
    	let { name = undefined } = $$props;
    	let { ref = null } = $$props;
    	const { range, add, hasCalendar, declareRef, inputIds, updateValue, blurInput, openCalendar, focusCalendar, inputValue, inputValueFrom, inputValueTo } = getContext("DatePicker");
    	validate_store(range, 'range');
    	component_subscribe($$self, range, value => $$invalidate(16, $range = value));
    	validate_store(hasCalendar, 'hasCalendar');
    	component_subscribe($$self, hasCalendar, value => $$invalidate(21, $hasCalendar = value));
    	validate_store(inputIds, 'inputIds');
    	component_subscribe($$self, inputIds, value => $$invalidate(17, $inputIds = value));
    	validate_store(inputValue, 'inputValue');
    	component_subscribe($$self, inputValue, value => $$invalidate(20, $inputValue = value));
    	validate_store(inputValueFrom, 'inputValueFrom');
    	component_subscribe($$self, inputValueFrom, value => $$invalidate(18, $inputValueFrom = value));
    	validate_store(inputValueTo, 'inputValueTo');
    	component_subscribe($$self, inputValueTo, value => $$invalidate(19, $inputValueTo = value));
    	add({ id, labelText });

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function paste_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	const input_handler_1 = ({ target }) => {
    		updateValue({ type: 'input', value: target.value });
    	};

    	const change_handler = ({ target }) => {
    		updateValue({ type: 'change', value: target.value });
    	};

    	const keydown_handler_1 = ({ key }) => {
    		if (key === 'ArrowDown') {
    			focusCalendar();
    		}
    	};

    	const blur_handler_1 = ({ relatedTarget }) => {
    		blurInput(relatedTarget);
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(33, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(1, size = $$new_props.size);
    		if ('type' in $$new_props) $$invalidate(2, type = $$new_props.type);
    		if ('placeholder' in $$new_props) $$invalidate(3, placeholder = $$new_props.placeholder);
    		if ('pattern' in $$new_props) $$invalidate(4, pattern = $$new_props.pattern);
    		if ('disabled' in $$new_props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ('helperText' in $$new_props) $$invalidate(6, helperText = $$new_props.helperText);
    		if ('iconDescription' in $$new_props) $$invalidate(7, iconDescription = $$new_props.iconDescription);
    		if ('id' in $$new_props) $$invalidate(8, id = $$new_props.id);
    		if ('labelText' in $$new_props) $$invalidate(9, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$new_props) $$invalidate(10, hideLabel = $$new_props.hideLabel);
    		if ('invalid' in $$new_props) $$invalidate(11, invalid = $$new_props.invalid);
    		if ('invalidText' in $$new_props) $$invalidate(12, invalidText = $$new_props.invalidText);
    		if ('warn' in $$new_props) $$invalidate(13, warn = $$new_props.warn);
    		if ('warnText' in $$new_props) $$invalidate(14, warnText = $$new_props.warnText);
    		if ('name' in $$new_props) $$invalidate(15, name = $$new_props.name);
    		if ('ref' in $$new_props) $$invalidate(0, ref = $$new_props.ref);
    		if ('$$scope' in $$new_props) $$invalidate(34, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		size,
    		type,
    		placeholder,
    		pattern,
    		disabled,
    		helperText,
    		iconDescription,
    		id,
    		labelText,
    		hideLabel,
    		invalid,
    		invalidText,
    		warn,
    		warnText,
    		name,
    		ref,
    		getContext,
    		Calendar: Calendar$1,
    		WarningFilled: WarningFilled$1,
    		WarningAltFilled: WarningAltFilled$1,
    		range,
    		add,
    		hasCalendar,
    		declareRef,
    		inputIds,
    		updateValue,
    		blurInput,
    		openCalendar,
    		focusCalendar,
    		inputValue,
    		inputValueFrom,
    		inputValueTo,
    		$range,
    		$inputIds,
    		$inputValueFrom,
    		$inputValueTo,
    		$inputValue,
    		$hasCalendar
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('size' in $$props) $$invalidate(1, size = $$new_props.size);
    		if ('type' in $$props) $$invalidate(2, type = $$new_props.type);
    		if ('placeholder' in $$props) $$invalidate(3, placeholder = $$new_props.placeholder);
    		if ('pattern' in $$props) $$invalidate(4, pattern = $$new_props.pattern);
    		if ('disabled' in $$props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ('helperText' in $$props) $$invalidate(6, helperText = $$new_props.helperText);
    		if ('iconDescription' in $$props) $$invalidate(7, iconDescription = $$new_props.iconDescription);
    		if ('id' in $$props) $$invalidate(8, id = $$new_props.id);
    		if ('labelText' in $$props) $$invalidate(9, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$props) $$invalidate(10, hideLabel = $$new_props.hideLabel);
    		if ('invalid' in $$props) $$invalidate(11, invalid = $$new_props.invalid);
    		if ('invalidText' in $$props) $$invalidate(12, invalidText = $$new_props.invalidText);
    		if ('warn' in $$props) $$invalidate(13, warn = $$new_props.warn);
    		if ('warnText' in $$props) $$invalidate(14, warnText = $$new_props.warnText);
    		if ('name' in $$props) $$invalidate(15, name = $$new_props.name);
    		if ('ref' in $$props) $$invalidate(0, ref = $$new_props.ref);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*ref, id*/ 257) {
    			if (ref) declareRef({ id, ref });
    		}
    	};

    	return [
    		ref,
    		size,
    		type,
    		placeholder,
    		pattern,
    		disabled,
    		helperText,
    		iconDescription,
    		id,
    		labelText,
    		hideLabel,
    		invalid,
    		invalidText,
    		warn,
    		warnText,
    		name,
    		$range,
    		$inputIds,
    		$inputValueFrom,
    		$inputValueTo,
    		$inputValue,
    		$hasCalendar,
    		range,
    		hasCalendar,
    		inputIds,
    		updateValue,
    		blurInput,
    		openCalendar,
    		focusCalendar,
    		inputValue,
    		inputValueFrom,
    		inputValueTo,
    		$$slots,
    		$$restProps,
    		$$scope,
    		slots,
    		input_handler,
    		keydown_handler,
    		keyup_handler,
    		blur_handler,
    		paste_handler,
    		input_binding,
    		input_handler_1,
    		change_handler,
    		keydown_handler_1,
    		blur_handler_1
    	];
    }

    class DatePickerInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$c,
    			create_fragment$c,
    			safe_not_equal,
    			{
    				size: 1,
    				type: 2,
    				placeholder: 3,
    				pattern: 4,
    				disabled: 5,
    				helperText: 6,
    				iconDescription: 7,
    				id: 8,
    				labelText: 9,
    				hideLabel: 10,
    				invalid: 11,
    				invalidText: 12,
    				warn: 13,
    				warnText: 14,
    				name: 15,
    				ref: 0
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DatePickerInput",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get size() {
    		throw new Error("<DatePickerInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<DatePickerInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<DatePickerInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<DatePickerInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<DatePickerInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<DatePickerInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pattern() {
    		throw new Error("<DatePickerInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pattern(value) {
    		throw new Error("<DatePickerInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<DatePickerInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<DatePickerInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperText() {
    		throw new Error("<DatePickerInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperText(value) {
    		throw new Error("<DatePickerInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDescription() {
    		throw new Error("<DatePickerInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDescription(value) {
    		throw new Error("<DatePickerInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<DatePickerInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<DatePickerInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelText() {
    		throw new Error("<DatePickerInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelText(value) {
    		throw new Error("<DatePickerInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideLabel() {
    		throw new Error("<DatePickerInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideLabel(value) {
    		throw new Error("<DatePickerInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<DatePickerInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<DatePickerInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalidText() {
    		throw new Error("<DatePickerInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalidText(value) {
    		throw new Error("<DatePickerInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warn() {
    		throw new Error("<DatePickerInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warn(value) {
    		throw new Error("<DatePickerInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warnText() {
    		throw new Error("<DatePickerInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warnText(value) {
    		throw new Error("<DatePickerInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<DatePickerInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<DatePickerInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<DatePickerInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<DatePickerInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var DatePickerInput$1 = DatePickerInput;

    /* node_modules/carbon-components-svelte/src/Dropdown/Dropdown.svelte generated by Svelte v3.55.1 */

    const file$a = "node_modules/carbon-components-svelte/src/Dropdown/Dropdown.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	child_ctx[41] = i;
    	return child_ctx;
    }

    const get_default_slot_changes = dirty => ({
    	item: dirty[0] & /*items*/ 8,
    	index: dirty[0] & /*items*/ 8
    });

    const get_default_slot_context = ctx => ({
    	item: /*item*/ ctx[39],
    	index: /*i*/ ctx[41]
    });

    // (184:2) {#if titleText}
    function create_if_block_5$2(ctx) {
    	let label_1;
    	let t;

    	const block = {
    		c: function create() {
    			label_1 = element("label");
    			t = text(/*titleText*/ ctx[10]);
    			attr_dev(label_1, "for", /*id*/ ctx[19]);
    			toggle_class(label_1, "bx--label", true);
    			toggle_class(label_1, "bx--label--disabled", /*disabled*/ ctx[9]);
    			toggle_class(label_1, "bx--visually-hidden", /*hideLabel*/ ctx[17]);
    			add_location(label_1, file$a, 184, 4, 4378);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label_1, anchor);
    			append_dev(label_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*titleText*/ 1024) set_data_dev(t, /*titleText*/ ctx[10]);

    			if (dirty[0] & /*id*/ 524288) {
    				attr_dev(label_1, "for", /*id*/ ctx[19]);
    			}

    			if (dirty[0] & /*disabled*/ 512) {
    				toggle_class(label_1, "bx--label--disabled", /*disabled*/ ctx[9]);
    			}

    			if (dirty[0] & /*hideLabel*/ 131072) {
    				toggle_class(label_1, "bx--visually-hidden", /*hideLabel*/ ctx[17]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(184:2) {#if titleText}",
    		ctx
    	});

    	return block;
    }

    // (222:4) {#if invalid}
    function create_if_block_4$2(ctx) {
    	let warningfilled;
    	let current;

    	warningfilled = new WarningFilled$1({
    			props: { class: "bx--list-box__invalid-icon" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warningfilled.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(warningfilled, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warningfilled.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warningfilled.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warningfilled, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(222:4) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (225:4) {#if !invalid && warn}
    function create_if_block_3$2(ctx) {
    	let warningaltfilled;
    	let current;

    	warningaltfilled = new WarningAltFilled$1({
    			props: {
    				class: "bx--list-box__invalid-icon bx--list-box__invalid-icon--warning"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warningaltfilled.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(warningaltfilled, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warningaltfilled.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warningaltfilled.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warningaltfilled, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(225:4) {#if !invalid && warn}",
    		ctx
    	});

    	return block;
    }

    // (287:54) {:else}
    function create_else_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*label*/ ctx[16]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*label*/ 65536) set_data_dev(t, /*label*/ ctx[16]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(287:54) {:else}",
    		ctx
    	});

    	return block;
    }

    // (287:8) {#if selectedItem}
    function create_if_block_2$3(ctx) {
    	let t_value = /*itemToString*/ ctx[4](/*selectedItem*/ ctx[22]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*itemToString, selectedItem*/ 4194320 && t_value !== (t_value = /*itemToString*/ ctx[4](/*selectedItem*/ ctx[22]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(287:8) {#if selectedItem}",
    		ctx
    	});

    	return block;
    }

    // (299:4) {#if open}
    function create_if_block_1$4(ctx) {
    	let listboxmenu;
    	let current;

    	listboxmenu = new ListBoxMenu$1({
    			props: {
    				"aria-labelledby": /*id*/ ctx[19],
    				id: /*id*/ ctx[19],
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(listboxmenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(listboxmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const listboxmenu_changes = {};
    			if (dirty[0] & /*id*/ 524288) listboxmenu_changes["aria-labelledby"] = /*id*/ ctx[19];
    			if (dirty[0] & /*id*/ 524288) listboxmenu_changes.id = /*id*/ ctx[19];

    			if (dirty[0] & /*items, selectedId, highlightedIndex, ref, itemToString*/ 2097181 | dirty[1] & /*$$scope*/ 64) {
    				listboxmenu_changes.$$scope = { dirty, ctx };
    			}

    			listboxmenu.$set(listboxmenu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(listboxmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(listboxmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(listboxmenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(299:4) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (321:44)
    function fallback_block$3(ctx) {
    	let t_value = /*itemToString*/ ctx[4](/*item*/ ctx[39]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*itemToString, items*/ 24 && t_value !== (t_value = /*itemToString*/ ctx[4](/*item*/ ctx[39]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$3.name,
    		type: "fallback",
    		source: "(321:44)                ",
    		ctx
    	});

    	return block;
    }

    // (302:10) <ListBoxMenuItem             id="{item.id}"             active="{selectedId === item.id}"             highlighted="{highlightedIndex === i}"             disabled="{item.disabled}"             on:click="{(e) => {               if (item.disabled) {                 e.stopPropagation();                 return;               }               selectedId = item.id;               dispatchSelect();               ref.focus();             }}"             on:mouseenter="{() => {               if (item.disabled) return;               highlightedIndex = i;             }}"           >
    function create_default_slot_2$2(ctx) {
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[29].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[37], get_default_slot_context);
    	const default_slot_or_fallback = default_slot || fallback_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*items*/ 8 | dirty[1] & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[37],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[37])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[37], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty[0] & /*itemToString, items*/ 24)) {
    					default_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(302:10) <ListBoxMenuItem             id=\\\"{item.id}\\\"             active=\\\"{selectedId === item.id}\\\"             highlighted=\\\"{highlightedIndex === i}\\\"             disabled=\\\"{item.disabled}\\\"             on:click=\\\"{(e) => {               if (item.disabled) {                 e.stopPropagation();                 return;               }               selectedId = item.id;               dispatchSelect();               ref.focus();             }}\\\"             on:mouseenter=\\\"{() => {               if (item.disabled) return;               highlightedIndex = i;             }}\\\"           >",
    		ctx
    	});

    	return block;
    }

    // (301:8) {#each items as item, i (item.id)}
    function create_each_block$1(key_1, ctx) {
    	let first;
    	let listboxmenuitem;
    	let current;

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[34](/*item*/ ctx[39], ...args);
    	}

    	function mouseenter_handler() {
    		return /*mouseenter_handler*/ ctx[35](/*item*/ ctx[39], /*i*/ ctx[41]);
    	}

    	listboxmenuitem = new ListBoxMenuItem$1({
    			props: {
    				id: /*item*/ ctx[39].id,
    				active: /*selectedId*/ ctx[0] === /*item*/ ctx[39].id,
    				highlighted: /*highlightedIndex*/ ctx[21] === /*i*/ ctx[41],
    				disabled: /*item*/ ctx[39].disabled,
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	listboxmenuitem.$on("click", click_handler_1);
    	listboxmenuitem.$on("mouseenter", mouseenter_handler);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(listboxmenuitem.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(listboxmenuitem, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const listboxmenuitem_changes = {};
    			if (dirty[0] & /*items*/ 8) listboxmenuitem_changes.id = /*item*/ ctx[39].id;
    			if (dirty[0] & /*selectedId, items*/ 9) listboxmenuitem_changes.active = /*selectedId*/ ctx[0] === /*item*/ ctx[39].id;
    			if (dirty[0] & /*highlightedIndex, items*/ 2097160) listboxmenuitem_changes.highlighted = /*highlightedIndex*/ ctx[21] === /*i*/ ctx[41];
    			if (dirty[0] & /*items*/ 8) listboxmenuitem_changes.disabled = /*item*/ ctx[39].disabled;

    			if (dirty[0] & /*itemToString, items*/ 24 | dirty[1] & /*$$scope*/ 64) {
    				listboxmenuitem_changes.$$scope = { dirty, ctx };
    			}

    			listboxmenuitem.$set(listboxmenuitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(listboxmenuitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(listboxmenuitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(listboxmenuitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(301:8) {#each items as item, i (item.id)}",
    		ctx
    	});

    	return block;
    }

    // (300:6) <ListBoxMenu aria-labelledby="{id}" id="{id}">
    function create_default_slot_1$2(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*items*/ ctx[3];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[39].id;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*items, selectedId, highlightedIndex, dispatchSelect, ref, itemToString*/ 35651613 | dirty[1] & /*$$scope*/ 64) {
    				each_value = /*items*/ ctx[3];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$1, each_1_anchor, get_each_context$1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(300:6) <ListBoxMenu aria-labelledby=\\\"{id}\\\" id=\\\"{id}\\\">",
    		ctx
    	});

    	return block;
    }

    // (194:2) <ListBox     role="{undefined}"     type="{type}"     size="{size}"     name="{name}"     aria-label="{$$props['aria-label']}"     class="bx--dropdown        {direction === 'top' && 'bx--list-box--up'}        {invalid && 'bx--dropdown--invalid'}        {!invalid && warn && 'bx--dropdown--warning'}        {open && 'bx--dropdown--open'}       {size === 'sm' && 'bx--dropdown--sm'}       {size === 'xl' && 'bx--dropdown--xl'}       {inline && 'bx--dropdown--inline'}       {disabled && 'bx--dropdown--disabled'}       {light && 'bx--dropdown--light'}"     on:click="{({ target }) => {       if (disabled) return;       open = ref.contains(target) ? !open : false;     }}"     disabled="{disabled}"     open="{open}"     invalid="{invalid}"     invalidText="{invalidText}"     light="{light}"     warn="{warn}"     warnText="{warnText}"   >
    function create_default_slot$2(ctx) {
    	let t0;
    	let t1;
    	let button;
    	let span;
    	let t2;
    	let listboxmenuicon;
    	let t3;
    	let if_block3_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*invalid*/ ctx[11] && create_if_block_4$2(ctx);
    	let if_block1 = !/*invalid*/ ctx[11] && /*warn*/ ctx[13] && create_if_block_3$2(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*selectedItem*/ ctx[22]) return create_if_block_2$3;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block2 = current_block_type(ctx);

    	listboxmenuicon = new ListBoxMenuIcon$1({
    			props: {
    				translateWithId: /*translateWithId*/ ctx[18],
    				open: /*open*/ ctx[1]
    			},
    			$$inline: true
    		});

    	listboxmenuicon.$on("click", /*click_handler*/ ctx[30]);
    	let if_block3 = /*open*/ ctx[1] && create_if_block_1$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			button = element("button");
    			span = element("span");
    			if_block2.c();
    			t2 = space();
    			create_component(listboxmenuicon.$$.fragment);
    			t3 = space();
    			if (if_block3) if_block3.c();
    			if_block3_anchor = empty();
    			toggle_class(span, "bx--list-box__label", true);
    			add_location(span, file$a, 285, 6, 7122);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "tabindex", "0");
    			attr_dev(button, "aria-expanded", /*open*/ ctx[1]);
    			button.disabled = /*disabled*/ ctx[9];
    			attr_dev(button, "translatewithid", /*translateWithId*/ ctx[18]);
    			attr_dev(button, "id", /*id*/ ctx[19]);
    			toggle_class(button, "bx--list-box__field", true);
    			add_location(button, file$a, 229, 4, 5650);
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button, anchor);
    			append_dev(button, span);
    			if_block2.m(span, null);
    			append_dev(button, t2);
    			mount_component(listboxmenuicon, button, null);
    			/*button_binding*/ ctx[31](button);
    			insert_dev(target, t3, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, if_block3_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "keydown", /*keydown_handler*/ ctx[32], false, false, false),
    					listen_dev(button, "keyup", /*keyup_handler*/ ctx[33], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*invalid*/ ctx[11]) {
    				if (if_block0) {
    					if (dirty[0] & /*invalid*/ 2048) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_4$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*invalid*/ ctx[11] && /*warn*/ ctx[13]) {
    				if (if_block1) {
    					if (dirty[0] & /*invalid, warn*/ 10240) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_3$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(span, null);
    				}
    			}

    			const listboxmenuicon_changes = {};
    			if (dirty[0] & /*translateWithId*/ 262144) listboxmenuicon_changes.translateWithId = /*translateWithId*/ ctx[18];
    			if (dirty[0] & /*open*/ 2) listboxmenuicon_changes.open = /*open*/ ctx[1];
    			listboxmenuicon.$set(listboxmenuicon_changes);

    			if (!current || dirty[0] & /*open*/ 2) {
    				attr_dev(button, "aria-expanded", /*open*/ ctx[1]);
    			}

    			if (!current || dirty[0] & /*disabled*/ 512) {
    				prop_dev(button, "disabled", /*disabled*/ ctx[9]);
    			}

    			if (!current || dirty[0] & /*translateWithId*/ 262144) {
    				attr_dev(button, "translatewithid", /*translateWithId*/ ctx[18]);
    			}

    			if (!current || dirty[0] & /*id*/ 524288) {
    				attr_dev(button, "id", /*id*/ ctx[19]);
    			}

    			if (/*open*/ ctx[1]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty[0] & /*open*/ 2) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_1$4(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(if_block3_anchor.parentNode, if_block3_anchor);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(listboxmenuicon.$$.fragment, local);
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(listboxmenuicon.$$.fragment, local);
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button);
    			if_block2.d();
    			destroy_component(listboxmenuicon);
    			/*button_binding*/ ctx[31](null);
    			if (detaching) detach_dev(t3);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(if_block3_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(194:2) <ListBox     role=\\\"{undefined}\\\"     type=\\\"{type}\\\"     size=\\\"{size}\\\"     name=\\\"{name}\\\"     aria-label=\\\"{$$props['aria-label']}\\\"     class=\\\"bx--dropdown        {direction === 'top' && 'bx--list-box--up'}        {invalid && 'bx--dropdown--invalid'}        {!invalid && warn && 'bx--dropdown--warning'}        {open && 'bx--dropdown--open'}       {size === 'sm' && 'bx--dropdown--sm'}       {size === 'xl' && 'bx--dropdown--xl'}       {inline && 'bx--dropdown--inline'}       {disabled && 'bx--dropdown--disabled'}       {light && 'bx--dropdown--light'}\\\"     on:click=\\\"{({ target }) => {       if (disabled) return;       open = ref.contains(target) ? !open : false;     }}\\\"     disabled=\\\"{disabled}\\\"     open=\\\"{open}\\\"     invalid=\\\"{invalid}\\\"     invalidText=\\\"{invalidText}\\\"     light=\\\"{light}\\\"     warn=\\\"{warn}\\\"     warnText=\\\"{warnText}\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (329:2) {#if !inline && !invalid && !warn && helperText}
    function create_if_block$9(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*helperText*/ ctx[15]);
    			toggle_class(div, "bx--form__helper-text", true);
    			toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[9]);
    			add_location(div, file$a, 329, 4, 8432);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*helperText*/ 32768) set_data_dev(t, /*helperText*/ ctx[15]);

    			if (dirty[0] & /*disabled*/ 512) {
    				toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[9]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(329:2) {#if !inline && !invalid && !warn && helperText}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div;
    	let t0;
    	let listbox;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*titleText*/ ctx[10] && create_if_block_5$2(ctx);

    	listbox = new ListBox$1({
    			props: {
    				role: undefined,
    				type: /*type*/ ctx[5],
    				size: /*size*/ ctx[7],
    				name: /*name*/ ctx[20],
    				"aria-label": /*$$props*/ ctx[28]['aria-label'],
    				class: "bx--dropdown \n      " + (/*direction*/ ctx[6] === 'top' && 'bx--list-box--up') + " \n      " + (/*invalid*/ ctx[11] && 'bx--dropdown--invalid') + " \n      " + (!/*invalid*/ ctx[11] && /*warn*/ ctx[13] && 'bx--dropdown--warning') + " \n      " + (/*open*/ ctx[1] && 'bx--dropdown--open') + "\n      " + (/*size*/ ctx[7] === 'sm' && 'bx--dropdown--sm') + "\n      " + (/*size*/ ctx[7] === 'xl' && 'bx--dropdown--xl') + "\n      " + (/*inline*/ ctx[23] && 'bx--dropdown--inline') + "\n      " + (/*disabled*/ ctx[9] && 'bx--dropdown--disabled') + "\n      " + (/*light*/ ctx[8] && 'bx--dropdown--light'),
    				disabled: /*disabled*/ ctx[9],
    				open: /*open*/ ctx[1],
    				invalid: /*invalid*/ ctx[11],
    				invalidText: /*invalidText*/ ctx[12],
    				light: /*light*/ ctx[8],
    				warn: /*warn*/ ctx[13],
    				warnText: /*warnText*/ ctx[14],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	listbox.$on("click", /*click_handler_2*/ ctx[36]);
    	let if_block1 = !/*inline*/ ctx[23] && !/*invalid*/ ctx[11] && !/*warn*/ ctx[13] && /*helperText*/ ctx[15] && create_if_block$9(ctx);
    	let div_levels = [/*$$restProps*/ ctx[27]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			create_component(listbox.$$.fragment);
    			t1 = space();
    			if (if_block1) if_block1.c();
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--dropdown__wrapper", true);
    			toggle_class(div, "bx--list-box__wrapper", true);
    			toggle_class(div, "bx--dropdown__wrapper--inline", /*inline*/ ctx[23]);
    			toggle_class(div, "bx--list-box__wrapper--inline", /*inline*/ ctx[23]);
    			toggle_class(div, "bx--dropdown__wrapper--inline--invalid", /*inline*/ ctx[23] && /*invalid*/ ctx[11]);
    			add_location(div, file$a, 175, 0, 4085);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			mount_component(listbox, div, null);
    			append_dev(div, t1);
    			if (if_block1) if_block1.m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "click", /*pageClickHandler*/ ctx[26], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*titleText*/ ctx[10]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_5$2(ctx);
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			const listbox_changes = {};
    			if (dirty[0] & /*type*/ 32) listbox_changes.type = /*type*/ ctx[5];
    			if (dirty[0] & /*size*/ 128) listbox_changes.size = /*size*/ ctx[7];
    			if (dirty[0] & /*name*/ 1048576) listbox_changes.name = /*name*/ ctx[20];
    			if (dirty[0] & /*$$props*/ 268435456) listbox_changes["aria-label"] = /*$$props*/ ctx[28]['aria-label'];
    			if (dirty[0] & /*direction, invalid, warn, open, size, inline, disabled, light*/ 8399810) listbox_changes.class = "bx--dropdown \n      " + (/*direction*/ ctx[6] === 'top' && 'bx--list-box--up') + " \n      " + (/*invalid*/ ctx[11] && 'bx--dropdown--invalid') + " \n      " + (!/*invalid*/ ctx[11] && /*warn*/ ctx[13] && 'bx--dropdown--warning') + " \n      " + (/*open*/ ctx[1] && 'bx--dropdown--open') + "\n      " + (/*size*/ ctx[7] === 'sm' && 'bx--dropdown--sm') + "\n      " + (/*size*/ ctx[7] === 'xl' && 'bx--dropdown--xl') + "\n      " + (/*inline*/ ctx[23] && 'bx--dropdown--inline') + "\n      " + (/*disabled*/ ctx[9] && 'bx--dropdown--disabled') + "\n      " + (/*light*/ ctx[8] && 'bx--dropdown--light');
    			if (dirty[0] & /*disabled*/ 512) listbox_changes.disabled = /*disabled*/ ctx[9];
    			if (dirty[0] & /*open*/ 2) listbox_changes.open = /*open*/ ctx[1];
    			if (dirty[0] & /*invalid*/ 2048) listbox_changes.invalid = /*invalid*/ ctx[11];
    			if (dirty[0] & /*invalidText*/ 4096) listbox_changes.invalidText = /*invalidText*/ ctx[12];
    			if (dirty[0] & /*light*/ 256) listbox_changes.light = /*light*/ ctx[8];
    			if (dirty[0] & /*warn*/ 8192) listbox_changes.warn = /*warn*/ ctx[13];
    			if (dirty[0] & /*warnText*/ 16384) listbox_changes.warnText = /*warnText*/ ctx[14];

    			if (dirty[0] & /*id, items, selectedId, highlightedIndex, ref, itemToString, open, disabled, translateWithId, selectedItem, label, invalid, warn*/ 7154207 | dirty[1] & /*$$scope*/ 64) {
    				listbox_changes.$$scope = { dirty, ctx };
    			}

    			listbox.$set(listbox_changes);

    			if (!/*inline*/ ctx[23] && !/*invalid*/ ctx[11] && !/*warn*/ ctx[13] && /*helperText*/ ctx[15]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$9(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty[0] & /*$$restProps*/ 134217728 && /*$$restProps*/ ctx[27]]));
    			toggle_class(div, "bx--dropdown__wrapper", true);
    			toggle_class(div, "bx--list-box__wrapper", true);
    			toggle_class(div, "bx--dropdown__wrapper--inline", /*inline*/ ctx[23]);
    			toggle_class(div, "bx--list-box__wrapper--inline", /*inline*/ ctx[23]);
    			toggle_class(div, "bx--dropdown__wrapper--inline--invalid", /*inline*/ ctx[23] && /*invalid*/ ctx[11]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(listbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(listbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			destroy_component(listbox);
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let inline;
    	let selectedItem;

    	const omit_props_names = [
    		"items","itemToString","selectedId","type","direction","size","open","light","disabled","titleText","invalid","invalidText","warn","warnText","helperText","label","hideLabel","translateWithId","id","name","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dropdown', slots, ['default']);
    	let { items = [] } = $$props;
    	let { itemToString = item => item.text || item.id } = $$props;
    	let { selectedId } = $$props;
    	let { type = "default" } = $$props;
    	let { direction = "bottom" } = $$props;
    	let { size = undefined } = $$props;
    	let { open = false } = $$props;
    	let { light = false } = $$props;
    	let { disabled = false } = $$props;
    	let { titleText = "" } = $$props;
    	let { invalid = false } = $$props;
    	let { invalidText = "" } = $$props;
    	let { warn = false } = $$props;
    	let { warnText = "" } = $$props;
    	let { helperText = "" } = $$props;
    	let { label = undefined } = $$props;
    	let { hideLabel = false } = $$props;
    	let { translateWithId = undefined } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { name = undefined } = $$props;
    	let { ref = null } = $$props;
    	const dispatch = createEventDispatcher();
    	let highlightedIndex = -1;

    	function change(dir) {
    		let index = highlightedIndex + dir;
    		if (items.length === 0) return;

    		if (index < 0) {
    			index = items.length - 1;
    		} else if (index >= items.length) {
    			index = 0;
    		}

    		let disabled = items[index].disabled;

    		while (disabled) {
    			index = index + dir;

    			if (index < 0) {
    				index = items.length - 1;
    			} else if (index >= items.length) {
    				index = 0;
    			}

    			disabled = items[index].disabled;
    		}

    		$$invalidate(21, highlightedIndex = index);
    	}

    	const dispatchSelect = () => {
    		dispatch("select", {
    			selectedId,
    			selectedItem: items.find(item => item.id === selectedId)
    		});
    	};

    	const pageClickHandler = ({ target }) => {
    		if (open && ref && !ref.contains(target)) {
    			$$invalidate(1, open = false);
    		}
    	};

    	onMount(() => {
    		if (parent) {
    			parent.addEventListener("click", pageClickHandler);
    		}

    		return () => {
    			if (parent) {
    				parent.removeEventListener("click", pageClickHandler);
    			}
    		};
    	});

    	$$self.$$.on_mount.push(function () {
    		if (selectedId === undefined && !('selectedId' in $$props || $$self.$$.bound[$$self.$$.props['selectedId']])) {
    			console.warn("<Dropdown> was created without expected prop 'selectedId'");
    		}
    	});

    	const click_handler = e => {
    		e.stopPropagation();
    		if (disabled) return;
    		$$invalidate(1, open = !open);
    	};

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(2, ref);
    		});
    	}

    	const keydown_handler = e => {
    		const { key } = e;

    		if (['Enter', 'ArrowDown', 'ArrowUp'].includes(key)) {
    			e.preventDefault();
    		}

    		if (key === 'Enter') {
    			$$invalidate(1, open = !open);

    			if (highlightedIndex > -1 && items[highlightedIndex].id !== selectedId) {
    				$$invalidate(0, selectedId = items[highlightedIndex].id);
    				dispatchSelect();
    				$$invalidate(1, open = false);
    			}
    		} else if (key === 'Tab') {
    			$$invalidate(1, open = false);
    			ref.blur();
    		} else if (key === 'ArrowDown') {
    			if (!open) $$invalidate(1, open = true);
    			change(1);
    		} else if (key === 'ArrowUp') {
    			if (!open) $$invalidate(1, open = true);
    			change(-1);
    		} else if (key === 'Escape') {
    			$$invalidate(1, open = false);
    		}
    	};

    	const keyup_handler = e => {
    		const { key } = e;

    		if ([' '].includes(key)) {
    			e.preventDefault();
    		} else {
    			return;
    		}

    		$$invalidate(1, open = !open);

    		if (highlightedIndex > -1 && items[highlightedIndex].id !== selectedId) {
    			$$invalidate(0, selectedId = items[highlightedIndex].id);
    			dispatchSelect();
    			$$invalidate(1, open = false);
    		}
    	};

    	const click_handler_1 = (item, e) => {
    		if (item.disabled) {
    			e.stopPropagation();
    			return;
    		}

    		$$invalidate(0, selectedId = item.id);
    		dispatchSelect();
    		ref.focus();
    	};

    	const mouseenter_handler = (item, i) => {
    		if (item.disabled) return;
    		$$invalidate(21, highlightedIndex = i);
    	};

    	const click_handler_2 = ({ target }) => {
    		if (disabled) return;
    		$$invalidate(1, open = ref.contains(target) ? !open : false);
    	};

    	$$self.$$set = $$new_props => {
    		$$invalidate(28, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(27, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('items' in $$new_props) $$invalidate(3, items = $$new_props.items);
    		if ('itemToString' in $$new_props) $$invalidate(4, itemToString = $$new_props.itemToString);
    		if ('selectedId' in $$new_props) $$invalidate(0, selectedId = $$new_props.selectedId);
    		if ('type' in $$new_props) $$invalidate(5, type = $$new_props.type);
    		if ('direction' in $$new_props) $$invalidate(6, direction = $$new_props.direction);
    		if ('size' in $$new_props) $$invalidate(7, size = $$new_props.size);
    		if ('open' in $$new_props) $$invalidate(1, open = $$new_props.open);
    		if ('light' in $$new_props) $$invalidate(8, light = $$new_props.light);
    		if ('disabled' in $$new_props) $$invalidate(9, disabled = $$new_props.disabled);
    		if ('titleText' in $$new_props) $$invalidate(10, titleText = $$new_props.titleText);
    		if ('invalid' in $$new_props) $$invalidate(11, invalid = $$new_props.invalid);
    		if ('invalidText' in $$new_props) $$invalidate(12, invalidText = $$new_props.invalidText);
    		if ('warn' in $$new_props) $$invalidate(13, warn = $$new_props.warn);
    		if ('warnText' in $$new_props) $$invalidate(14, warnText = $$new_props.warnText);
    		if ('helperText' in $$new_props) $$invalidate(15, helperText = $$new_props.helperText);
    		if ('label' in $$new_props) $$invalidate(16, label = $$new_props.label);
    		if ('hideLabel' in $$new_props) $$invalidate(17, hideLabel = $$new_props.hideLabel);
    		if ('translateWithId' in $$new_props) $$invalidate(18, translateWithId = $$new_props.translateWithId);
    		if ('id' in $$new_props) $$invalidate(19, id = $$new_props.id);
    		if ('name' in $$new_props) $$invalidate(20, name = $$new_props.name);
    		if ('ref' in $$new_props) $$invalidate(2, ref = $$new_props.ref);
    		if ('$$scope' in $$new_props) $$invalidate(37, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		items,
    		itemToString,
    		selectedId,
    		type,
    		direction,
    		size,
    		open,
    		light,
    		disabled,
    		titleText,
    		invalid,
    		invalidText,
    		warn,
    		warnText,
    		helperText,
    		label,
    		hideLabel,
    		translateWithId,
    		id,
    		name,
    		ref,
    		createEventDispatcher,
    		onMount,
    		WarningFilled: WarningFilled$1,
    		WarningAltFilled: WarningAltFilled$1,
    		ListBox: ListBox$1,
    		ListBoxMenu: ListBoxMenu$1,
    		ListBoxMenuIcon: ListBoxMenuIcon$1,
    		ListBoxMenuItem: ListBoxMenuItem$1,
    		dispatch,
    		highlightedIndex,
    		change,
    		dispatchSelect,
    		pageClickHandler,
    		selectedItem,
    		inline
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(28, $$props = assign(assign({}, $$props), $$new_props));
    		if ('items' in $$props) $$invalidate(3, items = $$new_props.items);
    		if ('itemToString' in $$props) $$invalidate(4, itemToString = $$new_props.itemToString);
    		if ('selectedId' in $$props) $$invalidate(0, selectedId = $$new_props.selectedId);
    		if ('type' in $$props) $$invalidate(5, type = $$new_props.type);
    		if ('direction' in $$props) $$invalidate(6, direction = $$new_props.direction);
    		if ('size' in $$props) $$invalidate(7, size = $$new_props.size);
    		if ('open' in $$props) $$invalidate(1, open = $$new_props.open);
    		if ('light' in $$props) $$invalidate(8, light = $$new_props.light);
    		if ('disabled' in $$props) $$invalidate(9, disabled = $$new_props.disabled);
    		if ('titleText' in $$props) $$invalidate(10, titleText = $$new_props.titleText);
    		if ('invalid' in $$props) $$invalidate(11, invalid = $$new_props.invalid);
    		if ('invalidText' in $$props) $$invalidate(12, invalidText = $$new_props.invalidText);
    		if ('warn' in $$props) $$invalidate(13, warn = $$new_props.warn);
    		if ('warnText' in $$props) $$invalidate(14, warnText = $$new_props.warnText);
    		if ('helperText' in $$props) $$invalidate(15, helperText = $$new_props.helperText);
    		if ('label' in $$props) $$invalidate(16, label = $$new_props.label);
    		if ('hideLabel' in $$props) $$invalidate(17, hideLabel = $$new_props.hideLabel);
    		if ('translateWithId' in $$props) $$invalidate(18, translateWithId = $$new_props.translateWithId);
    		if ('id' in $$props) $$invalidate(19, id = $$new_props.id);
    		if ('name' in $$props) $$invalidate(20, name = $$new_props.name);
    		if ('ref' in $$props) $$invalidate(2, ref = $$new_props.ref);
    		if ('highlightedIndex' in $$props) $$invalidate(21, highlightedIndex = $$new_props.highlightedIndex);
    		if ('selectedItem' in $$props) $$invalidate(22, selectedItem = $$new_props.selectedItem);
    		if ('inline' in $$props) $$invalidate(23, inline = $$new_props.inline);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*type*/ 32) {
    			$$invalidate(23, inline = type === "inline");
    		}

    		if ($$self.$$.dirty[0] & /*items, selectedId*/ 9) {
    			$$invalidate(22, selectedItem = items.find(item => item.id === selectedId));
    		}

    		if ($$self.$$.dirty[0] & /*open*/ 2) {
    			if (!open) {
    				$$invalidate(21, highlightedIndex = -1);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		selectedId,
    		open,
    		ref,
    		items,
    		itemToString,
    		type,
    		direction,
    		size,
    		light,
    		disabled,
    		titleText,
    		invalid,
    		invalidText,
    		warn,
    		warnText,
    		helperText,
    		label,
    		hideLabel,
    		translateWithId,
    		id,
    		name,
    		highlightedIndex,
    		selectedItem,
    		inline,
    		change,
    		dispatchSelect,
    		pageClickHandler,
    		$$restProps,
    		$$props,
    		slots,
    		click_handler,
    		button_binding,
    		keydown_handler,
    		keyup_handler,
    		click_handler_1,
    		mouseenter_handler,
    		click_handler_2,
    		$$scope
    	];
    }

    class Dropdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$b,
    			create_fragment$b,
    			safe_not_equal,
    			{
    				items: 3,
    				itemToString: 4,
    				selectedId: 0,
    				type: 5,
    				direction: 6,
    				size: 7,
    				open: 1,
    				light: 8,
    				disabled: 9,
    				titleText: 10,
    				invalid: 11,
    				invalidText: 12,
    				warn: 13,
    				warnText: 14,
    				helperText: 15,
    				label: 16,
    				hideLabel: 17,
    				translateWithId: 18,
    				id: 19,
    				name: 20,
    				ref: 2
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dropdown",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get items() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemToString() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemToString(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedId() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedId(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get direction() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleText() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleText(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalidText() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalidText(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warn() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warn(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warnText() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warnText(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperText() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperText(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideLabel() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideLabel(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translateWithId() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set translateWithId(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Dropdown$1 = Dropdown;

    /* node_modules/carbon-components-svelte/src/icons/CheckmarkFilled.svelte generated by Svelte v3.55.1 */

    const file$9 = "node_modules/carbon-components-svelte/src/icons/CheckmarkFilled.svelte";

    // (24:2) {#if title}
    function create_if_block$8(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$9, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let if_block = /*title*/ ctx[1] && create_if_block$8(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2ZM14,21.5908l-5-5L10.5906,15,14,18.4092,21.41,11l1.5957,1.5859Z");
    			add_location(path0, file$9, 24, 2, 579);
    			attr_dev(path1, "fill", "none");
    			attr_dev(path1, "d", "M14 21.591L9 16.591 10.591 15 14 18.409 21.41 11 23.005 12.585 14 21.591z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			add_location(path1, file$9, 26, 10, 707);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$9, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(svg, path0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CheckmarkFilled', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class CheckmarkFilled extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CheckmarkFilled",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get size() {
    		throw new Error("<CheckmarkFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<CheckmarkFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<CheckmarkFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<CheckmarkFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var CheckmarkFilled$1 = CheckmarkFilled;

    /* node_modules/carbon-components-svelte/src/icons/ErrorFilled.svelte generated by Svelte v3.55.1 */

    const file$8 = "node_modules/carbon-components-svelte/src/icons/ErrorFilled.svelte";

    // (24:2) {#if title}
    function create_if_block$7(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$8, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let if_block = /*title*/ ctx[1] && create_if_block$7(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "d", "M14.9 7.2H17.1V24.799H14.9z");
    			attr_dev(path0, "data-icon-path", "inner-path");
    			attr_dev(path0, "transform", "rotate(-45 16 16)");
    			add_location(path0, file$8, 24, 2, 579);
    			attr_dev(path1, "d", "M16,2A13.914,13.914,0,0,0,2,16,13.914,13.914,0,0,0,16,30,13.914,13.914,0,0,0,30,16,13.914,13.914,0,0,0,16,2Zm5.4449,21L9,10.5557,10.5557,9,23,21.4448Z");
    			add_location(path1, file$8, 28, 41, 710);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$8, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					if_block.m(svg, path0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ErrorFilled', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class ErrorFilled extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ErrorFilled",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get size() {
    		throw new Error("<ErrorFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ErrorFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ErrorFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ErrorFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ErrorFilled$1 = ErrorFilled;

    /* node_modules/carbon-components-svelte/src/Modal/Modal.svelte generated by Svelte v3.55.1 */
    const file$7 = "node_modules/carbon-components-svelte/src/Modal/Modal.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[55] = list[i];
    	return child_ctx;
    }

    const get_heading_slot_changes = dirty => ({});
    const get_heading_slot_context = ctx => ({});
    const get_label_slot_changes = dirty => ({});
    const get_label_slot_context = ctx => ({});

    // (211:6) {#if passiveModal}
    function create_if_block_6$1(ctx) {
    	let button;
    	let close;
    	let current;
    	let mounted;
    	let dispose;

    	close = new Close$1({
    			props: {
    				size: 20,
    				class: "bx--modal-close__icon",
    				"aria-hidden": "true"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(close.$$.fragment);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "aria-label", /*iconDescription*/ ctx[8]);
    			toggle_class(button, "bx--modal-close", true);
    			add_location(button, file$7, 211, 8, 5859);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(close, button, null);
    			/*button_binding*/ ctx[37](button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[38], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*iconDescription*/ 256) {
    				attr_dev(button, "aria-label", /*iconDescription*/ ctx[8]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(close.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(close.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(close);
    			/*button_binding*/ ctx[37](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(211:6) {#if passiveModal}",
    		ctx
    	});

    	return block;
    }

    // (224:6) {#if modalLabel}
    function create_if_block_5$1(ctx) {
    	let h2;
    	let current;
    	const label_slot_template = /*#slots*/ ctx[31].label;
    	const label_slot = create_slot(label_slot_template, ctx, /*$$scope*/ ctx[50], get_label_slot_context);
    	const label_slot_or_fallback = label_slot || fallback_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			if (label_slot_or_fallback) label_slot_or_fallback.c();
    			attr_dev(h2, "id", /*modalLabelId*/ ctx[25]);
    			toggle_class(h2, "bx--modal-header__label", true);
    			add_location(h2, file$7, 224, 8, 6228);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);

    			if (label_slot_or_fallback) {
    				label_slot_or_fallback.m(h2, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (label_slot) {
    				if (label_slot.p && (!current || dirty[1] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						label_slot,
    						label_slot_template,
    						ctx,
    						/*$$scope*/ ctx[50],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[50])
    						: get_slot_changes(label_slot_template, /*$$scope*/ ctx[50], dirty, get_label_slot_changes),
    						get_label_slot_context
    					);
    				}
    			} else {
    				if (label_slot_or_fallback && label_slot_or_fallback.p && (!current || dirty[0] & /*modalLabel*/ 128)) {
    					label_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*modalLabelId*/ 33554432) {
    				attr_dev(h2, "id", /*modalLabelId*/ ctx[25]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (label_slot_or_fallback) label_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(224:6) {#if modalLabel}",
    		ctx
    	});

    	return block;
    }

    // (226:29) {modalLabel}
    function fallback_block_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*modalLabel*/ ctx[7]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*modalLabel*/ 128) set_data_dev(t, /*modalLabel*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1$2.name,
    		type: "fallback",
    		source: "(226:29) {modalLabel}",
    		ctx
    	});

    	return block;
    }

    // (230:29) {modalHeading}
    function fallback_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*modalHeading*/ ctx[6]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*modalHeading*/ 64) set_data_dev(t, /*modalHeading*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$2.name,
    		type: "fallback",
    		source: "(230:29) {modalHeading}",
    		ctx
    	});

    	return block;
    }

    // (232:6) {#if !passiveModal}
    function create_if_block_4$1(ctx) {
    	let button;
    	let close;
    	let current;
    	let mounted;
    	let dispose;

    	close = new Close$1({
    			props: {
    				size: 20,
    				class: "bx--modal-close__icon",
    				"aria-hidden": "true"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(close.$$.fragment);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "aria-label", /*iconDescription*/ ctx[8]);
    			toggle_class(button, "bx--modal-close", true);
    			add_location(button, file$7, 232, 8, 6538);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(close, button, null);
    			/*button_binding_1*/ ctx[39](button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[40], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*iconDescription*/ 256) {
    				attr_dev(button, "aria-label", /*iconDescription*/ ctx[8]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(close.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(close.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(close);
    			/*button_binding_1*/ ctx[39](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(232:6) {#if !passiveModal}",
    		ctx
    	});

    	return block;
    }

    // (259:4) {#if hasScrollingContent}
    function create_if_block_3$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			toggle_class(div, "bx--modal-content--overflow-indicator", true);
    			add_location(div, file$7, 259, 6, 7450);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(259:4) {#if hasScrollingContent}",
    		ctx
    	});

    	return block;
    }

    // (262:4) {#if !passiveModal}
    function create_if_block$6(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let button;
    	let current;
    	const if_block_creators = [create_if_block_1$3, create_if_block_2$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*secondaryButtons*/ ctx[16].length > 0) return 0;
    		if (/*secondaryButtonText*/ ctx[15]) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	button = new Button$1({
    			props: {
    				kind: /*danger*/ ctx[3] ? 'danger' : 'primary',
    				disabled: /*primaryButtonDisabled*/ ctx[12],
    				icon: /*primaryButtonIcon*/ ctx[13],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler_5*/ ctx[43]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			create_component(button.$$.fragment);
    			toggle_class(div, "bx--modal-footer", true);
    			toggle_class(div, "bx--modal-footer--three-button", /*secondaryButtons*/ ctx[16].length === 2);
    			add_location(div, file$7, 262, 6, 7555);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			append_dev(div, t);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, t);
    				} else {
    					if_block = null;
    				}
    			}

    			const button_changes = {};
    			if (dirty[0] & /*danger*/ 8) button_changes.kind = /*danger*/ ctx[3] ? 'danger' : 'primary';
    			if (dirty[0] & /*primaryButtonDisabled*/ 4096) button_changes.disabled = /*primaryButtonDisabled*/ ctx[12];
    			if (dirty[0] & /*primaryButtonIcon*/ 8192) button_changes.icon = /*primaryButtonIcon*/ ctx[13];

    			if (dirty[0] & /*primaryButtonText*/ 2048 | dirty[1] & /*$$scope*/ 524288) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (!current || dirty[0] & /*secondaryButtons*/ 65536) {
    				toggle_class(div, "bx--modal-footer--three-button", /*secondaryButtons*/ ctx[16].length === 2);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(262:4) {#if !passiveModal}",
    		ctx
    	});

    	return block;
    }

    // (278:38)
    function create_if_block_2$2(ctx) {
    	let button;
    	let current;

    	button = new Button$1({
    			props: {
    				kind: "secondary",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler_4*/ ctx[42]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty[0] & /*secondaryButtonText*/ 32768 | dirty[1] & /*$$scope*/ 524288) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(278:38) ",
    		ctx
    	});

    	return block;
    }

    // (267:8) {#if secondaryButtons.length > 0}
    function create_if_block_1$3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*secondaryButtons*/ ctx[16];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*dispatch, secondaryButtons*/ 67174400) {
    				each_value = /*secondaryButtons*/ ctx[16];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(267:8) {#if secondaryButtons.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (279:10) <Button             kind="secondary"             on:click="{() => {               dispatch('click:button--secondary', {                 text: secondaryButtonText,               });             }}"           >
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*secondaryButtonText*/ ctx[15]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*secondaryButtonText*/ 32768) set_data_dev(t, /*secondaryButtonText*/ ctx[15]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(279:10) <Button             kind=\\\"secondary\\\"             on:click=\\\"{() => {               dispatch('click:button--secondary', {                 text: secondaryButtonText,               });             }}\\\"           >",
    		ctx
    	});

    	return block;
    }

    // (269:12) <Button               kind="secondary"               on:click="{() => {                 dispatch('click:button--secondary', { text: button.text });               }}"             >
    function create_default_slot_1$1(ctx) {
    	let t0_value = /*button*/ ctx[55].text + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*secondaryButtons*/ 65536 && t0_value !== (t0_value = /*button*/ ctx[55].text + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(269:12) <Button               kind=\\\"secondary\\\"               on:click=\\\"{() => {                 dispatch('click:button--secondary', { text: button.text });               }}\\\"             >",
    		ctx
    	});

    	return block;
    }

    // (268:10) {#each secondaryButtons as button}
    function create_each_block(ctx) {
    	let button;
    	let current;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[41](/*button*/ ctx[55]);
    	}

    	button = new Button$1({
    			props: {
    				kind: "secondary",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", click_handler_3);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const button_changes = {};

    			if (dirty[0] & /*secondaryButtons*/ 65536 | dirty[1] & /*$$scope*/ 524288) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(268:10) {#each secondaryButtons as button}",
    		ctx
    	});

    	return block;
    }

    // (290:8) <Button           kind="{danger ? 'danger' : 'primary'}"           disabled="{primaryButtonDisabled}"           icon="{primaryButtonIcon}"           on:click="{() => {             dispatch('submit');             dispatch('click:button--primary');           }}"         >
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*primaryButtonText*/ ctx[11]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*primaryButtonText*/ 2048) set_data_dev(t, /*primaryButtonText*/ ctx[11]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(290:8) <Button           kind=\\\"{danger ? 'danger' : 'primary'}\\\"           disabled=\\\"{primaryButtonDisabled}\\\"           icon=\\\"{primaryButtonIcon}\\\"           on:click=\\\"{() => {             dispatch('submit');             dispatch('click:button--primary');           }}\\\"         >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let t0;
    	let t1;
    	let h3;
    	let t2;
    	let t3;
    	let div1;
    	let div1_tabindex_value;
    	let div1_role_value;
    	let div1_aria_label_value;
    	let div1_aria_labelledby_value;
    	let t4;
    	let t5;
    	let div2_role_value;
    	let div2_aria_describedby_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*passiveModal*/ ctx[5] && create_if_block_6$1(ctx);
    	let if_block1 = /*modalLabel*/ ctx[7] && create_if_block_5$1(ctx);
    	const heading_slot_template = /*#slots*/ ctx[31].heading;
    	const heading_slot = create_slot(heading_slot_template, ctx, /*$$scope*/ ctx[50], get_heading_slot_context);
    	const heading_slot_or_fallback = heading_slot || fallback_block$2(ctx);
    	let if_block2 = !/*passiveModal*/ ctx[5] && create_if_block_4$1(ctx);
    	const default_slot_template = /*#slots*/ ctx[31].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[50], null);
    	let if_block3 = /*hasScrollingContent*/ ctx[10] && create_if_block_3$1(ctx);
    	let if_block4 = !/*passiveModal*/ ctx[5] && create_if_block$6(ctx);
    	let div3_levels = [{ role: "presentation" }, { id: /*id*/ ctx[18] }, /*$$restProps*/ ctx[28]];
    	let div3_data = {};

    	for (let i = 0; i < div3_levels.length; i += 1) {
    		div3_data = assign(div3_data, div3_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			h3 = element("h3");
    			if (heading_slot_or_fallback) heading_slot_or_fallback.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			t4 = space();
    			if (if_block3) if_block3.c();
    			t5 = space();
    			if (if_block4) if_block4.c();
    			attr_dev(h3, "id", /*modalHeadingId*/ ctx[24]);
    			toggle_class(h3, "bx--modal-header__heading", true);
    			add_location(h3, file$7, 228, 6, 6373);
    			toggle_class(div0, "bx--modal-header", true);
    			add_location(div0, file$7, 209, 4, 5788);
    			attr_dev(div1, "id", /*modalBodyId*/ ctx[23]);
    			attr_dev(div1, "tabindex", div1_tabindex_value = /*hasScrollingContent*/ ctx[10] ? '0' : undefined);
    			attr_dev(div1, "role", div1_role_value = /*hasScrollingContent*/ ctx[10] ? 'region' : undefined);

    			attr_dev(div1, "aria-label", div1_aria_label_value = /*hasScrollingContent*/ ctx[10]
    			? /*ariaLabel*/ ctx[22]
    			: undefined);

    			attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value = /*modalLabel*/ ctx[7]
    			? /*modalLabelId*/ ctx[25]
    			: /*modalHeadingId*/ ctx[24]);

    			toggle_class(div1, "bx--modal-content", true);
    			toggle_class(div1, "bx--modal-content--with-form", /*hasForm*/ ctx[9]);
    			toggle_class(div1, "bx--modal-scroll-content", /*hasScrollingContent*/ ctx[10]);
    			add_location(div1, file$7, 246, 4, 6950);
    			attr_dev(div2, "tabindex", "-1");

    			attr_dev(div2, "role", div2_role_value = /*alert*/ ctx[4]
    			? /*passiveModal*/ ctx[5] ? 'alert' : 'alertdialog'
    			: 'dialog');

    			attr_dev(div2, "aria-describedby", div2_aria_describedby_value = /*alert*/ ctx[4] && !/*passiveModal*/ ctx[5]
    			? /*modalBodyId*/ ctx[23]
    			: undefined);

    			attr_dev(div2, "aria-modal", "true");
    			attr_dev(div2, "aria-label", /*ariaLabel*/ ctx[22]);
    			toggle_class(div2, "bx--modal-container", true);
    			toggle_class(div2, "bx--modal-container--xs", /*size*/ ctx[2] === 'xs');
    			toggle_class(div2, "bx--modal-container--sm", /*size*/ ctx[2] === 'sm');
    			toggle_class(div2, "bx--modal-container--lg", /*size*/ ctx[2] === 'lg');
    			add_location(div2, file$7, 194, 2, 5271);
    			set_attributes(div3, div3_data);
    			toggle_class(div3, "bx--modal", true);
    			toggle_class(div3, "bx--modal-tall", !/*passiveModal*/ ctx[5]);
    			toggle_class(div3, "is-visible", /*open*/ ctx[0]);
    			toggle_class(div3, "bx--modal--danger", /*danger*/ ctx[3]);
    			add_location(div3, file$7, 135, 0, 3559);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t1);
    			append_dev(div0, h3);

    			if (heading_slot_or_fallback) {
    				heading_slot_or_fallback.m(h3, null);
    			}

    			append_dev(div0, t2);
    			if (if_block2) if_block2.m(div0, null);
    			append_dev(div2, t3);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div2, t4);
    			if (if_block3) if_block3.m(div2, null);
    			append_dev(div2, t5);
    			if (if_block4) if_block4.m(div2, null);
    			/*div2_binding*/ ctx[44](div2);
    			/*div3_binding*/ ctx[46](div3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "click", /*click_handler_6*/ ctx[45], false, false, false),
    					listen_dev(div3, "keydown", /*keydown_handler*/ ctx[32], false, false, false),
    					listen_dev(div3, "keydown", /*keydown_handler_1*/ ctx[47], false, false, false),
    					listen_dev(div3, "click", /*click_handler*/ ctx[33], false, false, false),
    					listen_dev(div3, "click", /*click_handler_7*/ ctx[48], false, false, false),
    					listen_dev(div3, "mouseover", /*mouseover_handler*/ ctx[34], false, false, false),
    					listen_dev(div3, "mouseenter", /*mouseenter_handler*/ ctx[35], false, false, false),
    					listen_dev(div3, "mouseleave", /*mouseleave_handler*/ ctx[36], false, false, false),
    					listen_dev(div3, "transitionend", /*transitionend_handler*/ ctx[49], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*passiveModal*/ ctx[5]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*passiveModal*/ 32) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_6$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*modalLabel*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*modalLabel*/ 128) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_5$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div0, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (heading_slot) {
    				if (heading_slot.p && (!current || dirty[1] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						heading_slot,
    						heading_slot_template,
    						ctx,
    						/*$$scope*/ ctx[50],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[50])
    						: get_slot_changes(heading_slot_template, /*$$scope*/ ctx[50], dirty, get_heading_slot_changes),
    						get_heading_slot_context
    					);
    				}
    			} else {
    				if (heading_slot_or_fallback && heading_slot_or_fallback.p && (!current || dirty[0] & /*modalHeading*/ 64)) {
    					heading_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*modalHeadingId*/ 16777216) {
    				attr_dev(h3, "id", /*modalHeadingId*/ ctx[24]);
    			}

    			if (!/*passiveModal*/ ctx[5]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*passiveModal*/ 32) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_4$1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div0, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[50],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[50])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[50], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty[0] & /*modalBodyId*/ 8388608) {
    				attr_dev(div1, "id", /*modalBodyId*/ ctx[23]);
    			}

    			if (!current || dirty[0] & /*hasScrollingContent*/ 1024 && div1_tabindex_value !== (div1_tabindex_value = /*hasScrollingContent*/ ctx[10] ? '0' : undefined)) {
    				attr_dev(div1, "tabindex", div1_tabindex_value);
    			}

    			if (!current || dirty[0] & /*hasScrollingContent*/ 1024 && div1_role_value !== (div1_role_value = /*hasScrollingContent*/ ctx[10] ? 'region' : undefined)) {
    				attr_dev(div1, "role", div1_role_value);
    			}

    			if (!current || dirty[0] & /*hasScrollingContent, ariaLabel*/ 4195328 && div1_aria_label_value !== (div1_aria_label_value = /*hasScrollingContent*/ ctx[10]
    			? /*ariaLabel*/ ctx[22]
    			: undefined)) {
    				attr_dev(div1, "aria-label", div1_aria_label_value);
    			}

    			if (!current || dirty[0] & /*modalLabel, modalLabelId, modalHeadingId*/ 50331776 && div1_aria_labelledby_value !== (div1_aria_labelledby_value = /*modalLabel*/ ctx[7]
    			? /*modalLabelId*/ ctx[25]
    			: /*modalHeadingId*/ ctx[24])) {
    				attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value);
    			}

    			if (!current || dirty[0] & /*hasForm*/ 512) {
    				toggle_class(div1, "bx--modal-content--with-form", /*hasForm*/ ctx[9]);
    			}

    			if (!current || dirty[0] & /*hasScrollingContent*/ 1024) {
    				toggle_class(div1, "bx--modal-scroll-content", /*hasScrollingContent*/ ctx[10]);
    			}

    			if (/*hasScrollingContent*/ ctx[10]) {
    				if (if_block3) ; else {
    					if_block3 = create_if_block_3$1(ctx);
    					if_block3.c();
    					if_block3.m(div2, t5);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (!/*passiveModal*/ ctx[5]) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty[0] & /*passiveModal*/ 32) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block$6(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div2, null);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*alert, passiveModal*/ 48 && div2_role_value !== (div2_role_value = /*alert*/ ctx[4]
    			? /*passiveModal*/ ctx[5] ? 'alert' : 'alertdialog'
    			: 'dialog')) {
    				attr_dev(div2, "role", div2_role_value);
    			}

    			if (!current || dirty[0] & /*alert, passiveModal, modalBodyId*/ 8388656 && div2_aria_describedby_value !== (div2_aria_describedby_value = /*alert*/ ctx[4] && !/*passiveModal*/ ctx[5]
    			? /*modalBodyId*/ ctx[23]
    			: undefined)) {
    				attr_dev(div2, "aria-describedby", div2_aria_describedby_value);
    			}

    			if (!current || dirty[0] & /*ariaLabel*/ 4194304) {
    				attr_dev(div2, "aria-label", /*ariaLabel*/ ctx[22]);
    			}

    			if (!current || dirty[0] & /*size*/ 4) {
    				toggle_class(div2, "bx--modal-container--xs", /*size*/ ctx[2] === 'xs');
    			}

    			if (!current || dirty[0] & /*size*/ 4) {
    				toggle_class(div2, "bx--modal-container--sm", /*size*/ ctx[2] === 'sm');
    			}

    			if (!current || dirty[0] & /*size*/ 4) {
    				toggle_class(div2, "bx--modal-container--lg", /*size*/ ctx[2] === 'lg');
    			}

    			set_attributes(div3, div3_data = get_spread_update(div3_levels, [
    				{ role: "presentation" },
    				(!current || dirty[0] & /*id*/ 262144) && { id: /*id*/ ctx[18] },
    				dirty[0] & /*$$restProps*/ 268435456 && /*$$restProps*/ ctx[28]
    			]));

    			toggle_class(div3, "bx--modal", true);
    			toggle_class(div3, "bx--modal-tall", !/*passiveModal*/ ctx[5]);
    			toggle_class(div3, "is-visible", /*open*/ ctx[0]);
    			toggle_class(div3, "bx--modal--danger", /*danger*/ ctx[3]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(heading_slot_or_fallback, local);
    			transition_in(if_block2);
    			transition_in(default_slot, local);
    			transition_in(if_block4);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(heading_slot_or_fallback, local);
    			transition_out(if_block2);
    			transition_out(default_slot, local);
    			transition_out(if_block4);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (heading_slot_or_fallback) heading_slot_or_fallback.d(detaching);
    			if (if_block2) if_block2.d();
    			if (default_slot) default_slot.d(detaching);
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			/*div2_binding*/ ctx[44](null);
    			/*div3_binding*/ ctx[46](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let modalLabelId;
    	let modalHeadingId;
    	let modalBodyId;
    	let ariaLabel;

    	const omit_props_names = [
    		"size","open","danger","alert","passiveModal","modalHeading","modalLabel","modalAriaLabel","iconDescription","hasForm","hasScrollingContent","primaryButtonText","primaryButtonDisabled","primaryButtonIcon","shouldSubmitOnEnter","secondaryButtonText","secondaryButtons","selectorPrimaryFocus","preventCloseOnClickOutside","id","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $openStore;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['label','heading','default']);
    	let { size = undefined } = $$props;
    	let { open = false } = $$props;
    	let { danger = false } = $$props;
    	let { alert = false } = $$props;
    	let { passiveModal = false } = $$props;
    	let { modalHeading = undefined } = $$props;
    	let { modalLabel = undefined } = $$props;
    	let { modalAriaLabel = undefined } = $$props;
    	let { iconDescription = "Close the modal" } = $$props;
    	let { hasForm = false } = $$props;
    	let { hasScrollingContent = false } = $$props;
    	let { primaryButtonText = "" } = $$props;
    	let { primaryButtonDisabled = false } = $$props;
    	let { primaryButtonIcon = undefined } = $$props;
    	let { shouldSubmitOnEnter = true } = $$props;
    	let { secondaryButtonText = "" } = $$props;
    	let { secondaryButtons = [] } = $$props;
    	let { selectorPrimaryFocus = "[data-modal-primary-focus]" } = $$props;
    	let { preventCloseOnClickOutside = false } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { ref = null } = $$props;
    	const dispatch = createEventDispatcher();
    	let buttonRef = null;
    	let innerModal = null;
    	let opened = false;
    	let didClickInnerModal = false;

    	function focus(element) {
    		const node = (element || innerModal).querySelector(selectorPrimaryFocus) || buttonRef;
    		node.focus();
    	}

    	const openStore = writable(open);
    	validate_store(openStore, 'openStore');
    	component_subscribe($$self, openStore, value => $$invalidate(52, $openStore = value));
    	trackModal(openStore);

    	afterUpdate(() => {
    		if (opened) {
    			if (!open) {
    				opened = false;
    				dispatch("close");
    			}
    		} else if (open) {
    			opened = true;
    			focus();
    			dispatch("open");
    		}
    	});

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			buttonRef = $$value;
    			$$invalidate(19, buttonRef);
    		});
    	}

    	const click_handler_1 = () => {
    		$$invalidate(0, open = false);
    	};

    	function button_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			buttonRef = $$value;
    			$$invalidate(19, buttonRef);
    		});
    	}

    	const click_handler_2 = () => {
    		$$invalidate(0, open = false);
    	};

    	const click_handler_3 = button => {
    		dispatch('click:button--secondary', { text: button.text });
    	};

    	const click_handler_4 = () => {
    		dispatch('click:button--secondary', { text: secondaryButtonText });
    	};

    	const click_handler_5 = () => {
    		dispatch('submit');
    		dispatch('click:button--primary');
    	};

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			innerModal = $$value;
    			$$invalidate(20, innerModal);
    		});
    	}

    	const click_handler_6 = () => {
    		$$invalidate(21, didClickInnerModal = true);
    	};

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	const keydown_handler_1 = e => {
    		if (open) {
    			if (e.key === 'Escape') {
    				$$invalidate(0, open = false);
    			} else if (e.key === 'Tab') {
    				// trap focus
    				// taken from github.com/carbon-design-system/carbon/packages/react/src/internal/keyboard/navigation.js
    				const selectorTabbable = `
  a[href], area[href], input:not([disabled]):not([tabindex='-1']),
  button:not([disabled]):not([tabindex='-1']),select:not([disabled]):not([tabindex='-1']),
  textarea:not([disabled]):not([tabindex='-1']),
  iframe, object, embed, *[tabindex]:not([tabindex='-1']):not([disabled]), *[contenteditable=true]
`;

    				const tabbable = Array.from(ref.querySelectorAll(selectorTabbable));
    				let index = tabbable.indexOf(document.activeElement);
    				if (index === -1 && e.shiftKey) index = 0;
    				index += tabbable.length + (e.shiftKey ? -1 : 1);
    				index %= tabbable.length;
    				tabbable[index].focus();
    				e.preventDefault();
    			} else if (shouldSubmitOnEnter && e.key === 'Enter' && !primaryButtonDisabled) {
    				dispatch('submit');
    				dispatch('click:button--primary');
    			}
    		}
    	};

    	const click_handler_7 = () => {
    		if (!didClickInnerModal && !preventCloseOnClickOutside) $$invalidate(0, open = false);
    		$$invalidate(21, didClickInnerModal = false);
    	};

    	const transitionend_handler = e => {
    		if (e.propertyName === 'transform') {
    			dispatch('transitionend', { open });
    		}
    	};

    	$$self.$$set = $$new_props => {
    		$$invalidate(54, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(28, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(2, size = $$new_props.size);
    		if ('open' in $$new_props) $$invalidate(0, open = $$new_props.open);
    		if ('danger' in $$new_props) $$invalidate(3, danger = $$new_props.danger);
    		if ('alert' in $$new_props) $$invalidate(4, alert = $$new_props.alert);
    		if ('passiveModal' in $$new_props) $$invalidate(5, passiveModal = $$new_props.passiveModal);
    		if ('modalHeading' in $$new_props) $$invalidate(6, modalHeading = $$new_props.modalHeading);
    		if ('modalLabel' in $$new_props) $$invalidate(7, modalLabel = $$new_props.modalLabel);
    		if ('modalAriaLabel' in $$new_props) $$invalidate(29, modalAriaLabel = $$new_props.modalAriaLabel);
    		if ('iconDescription' in $$new_props) $$invalidate(8, iconDescription = $$new_props.iconDescription);
    		if ('hasForm' in $$new_props) $$invalidate(9, hasForm = $$new_props.hasForm);
    		if ('hasScrollingContent' in $$new_props) $$invalidate(10, hasScrollingContent = $$new_props.hasScrollingContent);
    		if ('primaryButtonText' in $$new_props) $$invalidate(11, primaryButtonText = $$new_props.primaryButtonText);
    		if ('primaryButtonDisabled' in $$new_props) $$invalidate(12, primaryButtonDisabled = $$new_props.primaryButtonDisabled);
    		if ('primaryButtonIcon' in $$new_props) $$invalidate(13, primaryButtonIcon = $$new_props.primaryButtonIcon);
    		if ('shouldSubmitOnEnter' in $$new_props) $$invalidate(14, shouldSubmitOnEnter = $$new_props.shouldSubmitOnEnter);
    		if ('secondaryButtonText' in $$new_props) $$invalidate(15, secondaryButtonText = $$new_props.secondaryButtonText);
    		if ('secondaryButtons' in $$new_props) $$invalidate(16, secondaryButtons = $$new_props.secondaryButtons);
    		if ('selectorPrimaryFocus' in $$new_props) $$invalidate(30, selectorPrimaryFocus = $$new_props.selectorPrimaryFocus);
    		if ('preventCloseOnClickOutside' in $$new_props) $$invalidate(17, preventCloseOnClickOutside = $$new_props.preventCloseOnClickOutside);
    		if ('id' in $$new_props) $$invalidate(18, id = $$new_props.id);
    		if ('ref' in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    		if ('$$scope' in $$new_props) $$invalidate(50, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		size,
    		open,
    		danger,
    		alert,
    		passiveModal,
    		modalHeading,
    		modalLabel,
    		modalAriaLabel,
    		iconDescription,
    		hasForm,
    		hasScrollingContent,
    		primaryButtonText,
    		primaryButtonDisabled,
    		primaryButtonIcon,
    		shouldSubmitOnEnter,
    		secondaryButtonText,
    		secondaryButtons,
    		selectorPrimaryFocus,
    		preventCloseOnClickOutside,
    		id,
    		ref,
    		createEventDispatcher,
    		afterUpdate,
    		Close: Close$1,
    		Button: Button$1,
    		trackModal,
    		writable,
    		dispatch,
    		buttonRef,
    		innerModal,
    		opened,
    		didClickInnerModal,
    		focus,
    		openStore,
    		ariaLabel,
    		modalBodyId,
    		modalHeadingId,
    		modalLabelId,
    		$openStore
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(54, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(2, size = $$new_props.size);
    		if ('open' in $$props) $$invalidate(0, open = $$new_props.open);
    		if ('danger' in $$props) $$invalidate(3, danger = $$new_props.danger);
    		if ('alert' in $$props) $$invalidate(4, alert = $$new_props.alert);
    		if ('passiveModal' in $$props) $$invalidate(5, passiveModal = $$new_props.passiveModal);
    		if ('modalHeading' in $$props) $$invalidate(6, modalHeading = $$new_props.modalHeading);
    		if ('modalLabel' in $$props) $$invalidate(7, modalLabel = $$new_props.modalLabel);
    		if ('modalAriaLabel' in $$props) $$invalidate(29, modalAriaLabel = $$new_props.modalAriaLabel);
    		if ('iconDescription' in $$props) $$invalidate(8, iconDescription = $$new_props.iconDescription);
    		if ('hasForm' in $$props) $$invalidate(9, hasForm = $$new_props.hasForm);
    		if ('hasScrollingContent' in $$props) $$invalidate(10, hasScrollingContent = $$new_props.hasScrollingContent);
    		if ('primaryButtonText' in $$props) $$invalidate(11, primaryButtonText = $$new_props.primaryButtonText);
    		if ('primaryButtonDisabled' in $$props) $$invalidate(12, primaryButtonDisabled = $$new_props.primaryButtonDisabled);
    		if ('primaryButtonIcon' in $$props) $$invalidate(13, primaryButtonIcon = $$new_props.primaryButtonIcon);
    		if ('shouldSubmitOnEnter' in $$props) $$invalidate(14, shouldSubmitOnEnter = $$new_props.shouldSubmitOnEnter);
    		if ('secondaryButtonText' in $$props) $$invalidate(15, secondaryButtonText = $$new_props.secondaryButtonText);
    		if ('secondaryButtons' in $$props) $$invalidate(16, secondaryButtons = $$new_props.secondaryButtons);
    		if ('selectorPrimaryFocus' in $$props) $$invalidate(30, selectorPrimaryFocus = $$new_props.selectorPrimaryFocus);
    		if ('preventCloseOnClickOutside' in $$props) $$invalidate(17, preventCloseOnClickOutside = $$new_props.preventCloseOnClickOutside);
    		if ('id' in $$props) $$invalidate(18, id = $$new_props.id);
    		if ('ref' in $$props) $$invalidate(1, ref = $$new_props.ref);
    		if ('buttonRef' in $$props) $$invalidate(19, buttonRef = $$new_props.buttonRef);
    		if ('innerModal' in $$props) $$invalidate(20, innerModal = $$new_props.innerModal);
    		if ('opened' in $$props) opened = $$new_props.opened;
    		if ('didClickInnerModal' in $$props) $$invalidate(21, didClickInnerModal = $$new_props.didClickInnerModal);
    		if ('ariaLabel' in $$props) $$invalidate(22, ariaLabel = $$new_props.ariaLabel);
    		if ('modalBodyId' in $$props) $$invalidate(23, modalBodyId = $$new_props.modalBodyId);
    		if ('modalHeadingId' in $$props) $$invalidate(24, modalHeadingId = $$new_props.modalHeadingId);
    		if ('modalLabelId' in $$props) $$invalidate(25, modalLabelId = $$new_props.modalLabelId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*open*/ 1) {
    			set_store_value(openStore, $openStore = open, $openStore);
    		}

    		if ($$self.$$.dirty[0] & /*id*/ 262144) {
    			$$invalidate(25, modalLabelId = `bx--modal-header__label--modal-${id}`);
    		}

    		if ($$self.$$.dirty[0] & /*id*/ 262144) {
    			$$invalidate(24, modalHeadingId = `bx--modal-header__heading--modal-${id}`);
    		}

    		if ($$self.$$.dirty[0] & /*id*/ 262144) {
    			$$invalidate(23, modalBodyId = `bx--modal-body--${id}`);
    		}

    		$$invalidate(22, ariaLabel = modalLabel || $$props["aria-label"] || modalAriaLabel || modalHeading);
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		open,
    		ref,
    		size,
    		danger,
    		alert,
    		passiveModal,
    		modalHeading,
    		modalLabel,
    		iconDescription,
    		hasForm,
    		hasScrollingContent,
    		primaryButtonText,
    		primaryButtonDisabled,
    		primaryButtonIcon,
    		shouldSubmitOnEnter,
    		secondaryButtonText,
    		secondaryButtons,
    		preventCloseOnClickOutside,
    		id,
    		buttonRef,
    		innerModal,
    		didClickInnerModal,
    		ariaLabel,
    		modalBodyId,
    		modalHeadingId,
    		modalLabelId,
    		dispatch,
    		openStore,
    		$$restProps,
    		modalAriaLabel,
    		selectorPrimaryFocus,
    		slots,
    		keydown_handler,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		button_binding,
    		click_handler_1,
    		button_binding_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		div2_binding,
    		click_handler_6,
    		div3_binding,
    		keydown_handler_1,
    		click_handler_7,
    		transitionend_handler,
    		$$scope
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$8,
    			create_fragment$8,
    			safe_not_equal,
    			{
    				size: 2,
    				open: 0,
    				danger: 3,
    				alert: 4,
    				passiveModal: 5,
    				modalHeading: 6,
    				modalLabel: 7,
    				modalAriaLabel: 29,
    				iconDescription: 8,
    				hasForm: 9,
    				hasScrollingContent: 10,
    				primaryButtonText: 11,
    				primaryButtonDisabled: 12,
    				primaryButtonIcon: 13,
    				shouldSubmitOnEnter: 14,
    				secondaryButtonText: 15,
    				secondaryButtons: 16,
    				selectorPrimaryFocus: 30,
    				preventCloseOnClickOutside: 17,
    				id: 18,
    				ref: 1
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get size() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get danger() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set danger(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alert() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alert(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get passiveModal() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set passiveModal(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get modalHeading() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modalHeading(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get modalLabel() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modalLabel(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get modalAriaLabel() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modalAriaLabel(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDescription() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDescription(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasForm() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasForm(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasScrollingContent() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasScrollingContent(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primaryButtonText() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primaryButtonText(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primaryButtonDisabled() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primaryButtonDisabled(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primaryButtonIcon() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primaryButtonIcon(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shouldSubmitOnEnter() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shouldSubmitOnEnter(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get secondaryButtonText() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set secondaryButtonText(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get secondaryButtons() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set secondaryButtons(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectorPrimaryFocus() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectorPrimaryFocus(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get preventCloseOnClickOutside() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set preventCloseOnClickOutside(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Modal$1 = Modal;

    /* node_modules/carbon-components-svelte/src/Notification/NotificationButton.svelte generated by Svelte v3.55.1 */
    const file$6 = "node_modules/carbon-components-svelte/src/Notification/NotificationButton.svelte";

    function create_fragment$7(ctx) {
    	let button;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = /*icon*/ ctx[1];

    	function switch_props(ctx) {
    		return {
    			props: {
    				size: 20,
    				title: /*title*/ ctx[2],
    				class: "" + ((/*notificationType*/ ctx[0] === 'toast' && 'bx--toast-notification__close-icon') + " " + (/*notificationType*/ ctx[0] === 'inline' && 'bx--inline-notification__close-icon'))
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	let button_levels = [
    		{ type: "button" },
    		{ "aria-label": /*iconDescription*/ ctx[3] },
    		{ title: /*iconDescription*/ ctx[3] },
    		/*$$restProps*/ ctx[4]
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			set_attributes(button, button_data);
    			toggle_class(button, "bx--toast-notification__close-button", /*notificationType*/ ctx[0] === 'toast');
    			toggle_class(button, "bx--inline-notification__close-button", /*notificationType*/ ctx[0] === 'inline');
    			add_location(button, file$6, 26, 0, 558);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			if (switch_instance) mount_component(switch_instance, button, null);
    			if (button.autofocus) button.focus();
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false),
    					listen_dev(button, "mouseover", /*mouseover_handler*/ ctx[6], false, false, false),
    					listen_dev(button, "mouseenter", /*mouseenter_handler*/ ctx[7], false, false, false),
    					listen_dev(button, "mouseleave", /*mouseleave_handler*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*title*/ 4) switch_instance_changes.title = /*title*/ ctx[2];
    			if (dirty & /*notificationType*/ 1) switch_instance_changes.class = "" + ((/*notificationType*/ ctx[0] === 'toast' && 'bx--toast-notification__close-icon') + " " + (/*notificationType*/ ctx[0] === 'inline' && 'bx--inline-notification__close-icon'));

    			if (switch_value !== (switch_value = /*icon*/ ctx[1])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, button, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				{ type: "button" },
    				(!current || dirty & /*iconDescription*/ 8) && { "aria-label": /*iconDescription*/ ctx[3] },
    				(!current || dirty & /*iconDescription*/ 8) && { title: /*iconDescription*/ ctx[3] },
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]
    			]));

    			toggle_class(button, "bx--toast-notification__close-button", /*notificationType*/ ctx[0] === 'toast');
    			toggle_class(button, "bx--inline-notification__close-button", /*notificationType*/ ctx[0] === 'inline');
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (switch_instance) destroy_component(switch_instance);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	const omit_props_names = ["notificationType","icon","title","iconDescription"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NotificationButton', slots, []);
    	let { notificationType = "toast" } = $$props;
    	let { icon = Close$1 } = $$props;
    	let { title = undefined } = $$props;
    	let { iconDescription = "Close icon" } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('notificationType' in $$new_props) $$invalidate(0, notificationType = $$new_props.notificationType);
    		if ('icon' in $$new_props) $$invalidate(1, icon = $$new_props.icon);
    		if ('title' in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ('iconDescription' in $$new_props) $$invalidate(3, iconDescription = $$new_props.iconDescription);
    	};

    	$$self.$capture_state = () => ({
    		notificationType,
    		icon,
    		title,
    		iconDescription,
    		Close: Close$1
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('notificationType' in $$props) $$invalidate(0, notificationType = $$new_props.notificationType);
    		if ('icon' in $$props) $$invalidate(1, icon = $$new_props.icon);
    		if ('title' in $$props) $$invalidate(2, title = $$new_props.title);
    		if ('iconDescription' in $$props) $$invalidate(3, iconDescription = $$new_props.iconDescription);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		notificationType,
    		icon,
    		title,
    		iconDescription,
    		$$restProps,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class NotificationButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			notificationType: 0,
    			icon: 1,
    			title: 2,
    			iconDescription: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotificationButton",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get notificationType() {
    		throw new Error("<NotificationButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set notificationType(value) {
    		throw new Error("<NotificationButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<NotificationButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<NotificationButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<NotificationButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<NotificationButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDescription() {
    		throw new Error("<NotificationButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDescription(value) {
    		throw new Error("<NotificationButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var NotificationButton$1 = NotificationButton;

    /* node_modules/carbon-components-svelte/src/icons/InformationFilled.svelte generated by Svelte v3.55.1 */

    const file$5 = "node_modules/carbon-components-svelte/src/icons/InformationFilled.svelte";

    // (24:2) {#if title}
    function create_if_block$5(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$5, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let if_block = /*title*/ ctx[1] && create_if_block$5(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "d", "M16,8a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,8Zm4,13.875H17.125v-8H13v2.25h1.875v5.75H12v2.25h8Z");
    			attr_dev(path0, "data-icon-path", "inner-path");
    			add_location(path0, file$5, 24, 2, 579);
    			attr_dev(path1, "d", "M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,6a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,8Zm4,16.125H12v-2.25h2.875v-5.75H13v-2.25h4.125v8H20Z");
    			add_location(path1, file$5, 27, 39, 745);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$5, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(svg, path0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InformationFilled', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class InformationFilled extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InformationFilled",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get size() {
    		throw new Error("<InformationFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<InformationFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<InformationFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<InformationFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var InformationFilled$1 = InformationFilled;

    /* node_modules/carbon-components-svelte/src/icons/InformationSquareFilled.svelte generated by Svelte v3.55.1 */

    const file$4 = "node_modules/carbon-components-svelte/src/icons/InformationSquareFilled.svelte";

    // (24:2) {#if title}
    function create_if_block$4(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$4, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let if_block = /*title*/ ctx[1] && create_if_block$4(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "d", "M16,8a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,8Zm4,13.875H17.125v-8H13v2.25h1.875v5.75H12v2.25h8Z");
    			attr_dev(path0, "data-icon-path", "inner-path");
    			add_location(path0, file$4, 24, 2, 579);
    			attr_dev(path1, "d", "M26,4H6A2,2,0,0,0,4,6V26a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2V6A2,2,0,0,0,26,4ZM16,8a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,8Zm4,16.125H12v-2.25h2.875v-5.75H13v-2.25h4.125v8H20Z");
    			add_location(path1, file$4, 27, 39, 745);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$4, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(svg, path0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InformationSquareFilled', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class InformationSquareFilled extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InformationSquareFilled",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get size() {
    		throw new Error("<InformationSquareFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<InformationSquareFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<InformationSquareFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<InformationSquareFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var InformationSquareFilled$1 = InformationSquareFilled;

    /* node_modules/carbon-components-svelte/src/Notification/NotificationIcon.svelte generated by Svelte v3.55.1 */

    function create_fragment$4(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*icons*/ ctx[3][/*kind*/ ctx[0]];

    	function switch_props(ctx) {
    		return {
    			props: {
    				size: 20,
    				title: /*iconDescription*/ ctx[2],
    				class: "" + ((/*notificationType*/ ctx[1] === 'toast' && 'bx--toast-notification__icon') + " " + (/*notificationType*/ ctx[1] === 'inline' && 'bx--inline-notification__icon'))
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*iconDescription*/ 4) switch_instance_changes.title = /*iconDescription*/ ctx[2];
    			if (dirty & /*notificationType*/ 2) switch_instance_changes.class = "" + ((/*notificationType*/ ctx[1] === 'toast' && 'bx--toast-notification__icon') + " " + (/*notificationType*/ ctx[1] === 'inline' && 'bx--inline-notification__icon'));

    			if (switch_value !== (switch_value = /*icons*/ ctx[3][/*kind*/ ctx[0]])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NotificationIcon', slots, []);
    	let { kind = "error" } = $$props;
    	let { notificationType = "toast" } = $$props;
    	let { iconDescription } = $$props;

    	const icons = {
    		error: ErrorFilled$1,
    		"info-square": InformationSquareFilled$1,
    		info: InformationFilled$1,
    		success: CheckmarkFilled$1,
    		warning: WarningFilled$1,
    		"warning-alt": WarningAltFilled$1
    	};

    	$$self.$$.on_mount.push(function () {
    		if (iconDescription === undefined && !('iconDescription' in $$props || $$self.$$.bound[$$self.$$.props['iconDescription']])) {
    			console.warn("<NotificationIcon> was created without expected prop 'iconDescription'");
    		}
    	});

    	const writable_props = ['kind', 'notificationType', 'iconDescription'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NotificationIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('kind' in $$props) $$invalidate(0, kind = $$props.kind);
    		if ('notificationType' in $$props) $$invalidate(1, notificationType = $$props.notificationType);
    		if ('iconDescription' in $$props) $$invalidate(2, iconDescription = $$props.iconDescription);
    	};

    	$$self.$capture_state = () => ({
    		kind,
    		notificationType,
    		iconDescription,
    		CheckmarkFilled: CheckmarkFilled$1,
    		ErrorFilled: ErrorFilled$1,
    		InformationFilled: InformationFilled$1,
    		InformationSquareFilled: InformationSquareFilled$1,
    		WarningFilled: WarningFilled$1,
    		WarningAltFilled: WarningAltFilled$1,
    		icons
    	});

    	$$self.$inject_state = $$props => {
    		if ('kind' in $$props) $$invalidate(0, kind = $$props.kind);
    		if ('notificationType' in $$props) $$invalidate(1, notificationType = $$props.notificationType);
    		if ('iconDescription' in $$props) $$invalidate(2, iconDescription = $$props.iconDescription);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [kind, notificationType, iconDescription, icons];
    }

    class NotificationIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			kind: 0,
    			notificationType: 1,
    			iconDescription: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotificationIcon",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get kind() {
    		throw new Error("<NotificationIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kind(value) {
    		throw new Error("<NotificationIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get notificationType() {
    		throw new Error("<NotificationIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set notificationType(value) {
    		throw new Error("<NotificationIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDescription() {
    		throw new Error("<NotificationIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDescription(value) {
    		throw new Error("<NotificationIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var NotificationIcon$1 = NotificationIcon;

    /* node_modules/carbon-components-svelte/src/Notification/InlineNotification.svelte generated by Svelte v3.55.1 */
    const file$3 = "node_modules/carbon-components-svelte/src/Notification/InlineNotification.svelte";
    const get_actions_slot_changes = dirty => ({});
    const get_actions_slot_context = ctx => ({});
    const get_subtitle_slot_changes = dirty => ({});
    const get_subtitle_slot_context = ctx => ({});
    const get_title_slot_changes = dirty => ({});
    const get_title_slot_context = ctx => ({});

    // (71:0) {#if open}
    function create_if_block$3(ctx) {
    	let div3;
    	let div2;
    	let notificationicon;
    	let t0;
    	let div1;
    	let p;
    	let t1;
    	let div0;
    	let t2;
    	let t3;
    	let t4;
    	let current;
    	let mounted;
    	let dispose;

    	notificationicon = new NotificationIcon$1({
    			props: {
    				notificationType: "inline",
    				kind: /*kind*/ ctx[0],
    				iconDescription: /*statusIconDescription*/ ctx[6]
    			},
    			$$inline: true
    		});

    	const title_slot_template = /*#slots*/ ctx[13].title;
    	const title_slot = create_slot(title_slot_template, ctx, /*$$scope*/ ctx[12], get_title_slot_context);
    	const title_slot_or_fallback = title_slot || fallback_block_1$1(ctx);
    	const subtitle_slot_template = /*#slots*/ ctx[13].subtitle;
    	const subtitle_slot = create_slot(subtitle_slot_template, ctx, /*$$scope*/ ctx[12], get_subtitle_slot_context);
    	const subtitle_slot_or_fallback = subtitle_slot || fallback_block$1(ctx);
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	const actions_slot_template = /*#slots*/ ctx[13].actions;
    	const actions_slot = create_slot(actions_slot_template, ctx, /*$$scope*/ ctx[12], get_actions_slot_context);
    	let if_block = !/*hideCloseButton*/ ctx[5] && create_if_block_1$2(ctx);
    	let div3_levels = [{ role: /*role*/ ctx[2] }, { kind: /*kind*/ ctx[0] }, /*$$restProps*/ ctx[10]];
    	let div3_data = {};

    	for (let i = 0; i < div3_levels.length; i += 1) {
    		div3_data = assign(div3_data, div3_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			create_component(notificationicon.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			p = element("p");
    			if (title_slot_or_fallback) title_slot_or_fallback.c();
    			t1 = space();
    			div0 = element("div");
    			if (subtitle_slot_or_fallback) subtitle_slot_or_fallback.c();
    			t2 = space();
    			if (default_slot) default_slot.c();
    			t3 = space();
    			if (actions_slot) actions_slot.c();
    			t4 = space();
    			if (if_block) if_block.c();
    			toggle_class(p, "bx--inline-notification__title", true);
    			add_location(p, file$3, 96, 8, 2684);
    			toggle_class(div0, "bx--inline-notification__subtitle", true);
    			add_location(div0, file$3, 99, 8, 2799);
    			toggle_class(div1, "bx--inline-notification__text-wrapper", true);
    			add_location(div1, file$3, 95, 6, 2617);
    			toggle_class(div2, "bx--inline-notification__details", true);
    			add_location(div2, file$3, 89, 4, 2418);
    			set_attributes(div3, div3_data);
    			toggle_class(div3, "bx--inline-notification", true);
    			toggle_class(div3, "bx--inline-notification--low-contrast", /*lowContrast*/ ctx[1]);
    			toggle_class(div3, "bx--inline-notification--hide-close-button", /*hideCloseButton*/ ctx[5]);
    			toggle_class(div3, "bx--inline-notification--error", /*kind*/ ctx[0] === 'error');
    			toggle_class(div3, "bx--inline-notification--info", /*kind*/ ctx[0] === 'info');
    			toggle_class(div3, "bx--inline-notification--info-square", /*kind*/ ctx[0] === 'info-square');
    			toggle_class(div3, "bx--inline-notification--success", /*kind*/ ctx[0] === 'success');
    			toggle_class(div3, "bx--inline-notification--warning", /*kind*/ ctx[0] === 'warning');
    			toggle_class(div3, "bx--inline-notification--warning-alt", /*kind*/ ctx[0] === 'warning-alt');
    			add_location(div3, file$3, 71, 2, 1700);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			mount_component(notificationicon, div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, p);

    			if (title_slot_or_fallback) {
    				title_slot_or_fallback.m(p, null);
    			}

    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			if (subtitle_slot_or_fallback) {
    				subtitle_slot_or_fallback.m(div0, null);
    			}

    			append_dev(div1, t2);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div3, t3);

    			if (actions_slot) {
    				actions_slot.m(div3, null);
    			}

    			append_dev(div3, t4);
    			if (if_block) if_block.m(div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div3, "click", /*click_handler*/ ctx[14], false, false, false),
    					listen_dev(div3, "mouseover", /*mouseover_handler*/ ctx[15], false, false, false),
    					listen_dev(div3, "mouseenter", /*mouseenter_handler*/ ctx[16], false, false, false),
    					listen_dev(div3, "mouseleave", /*mouseleave_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const notificationicon_changes = {};
    			if (dirty & /*kind*/ 1) notificationicon_changes.kind = /*kind*/ ctx[0];
    			if (dirty & /*statusIconDescription*/ 64) notificationicon_changes.iconDescription = /*statusIconDescription*/ ctx[6];
    			notificationicon.$set(notificationicon_changes);

    			if (title_slot) {
    				if (title_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						title_slot,
    						title_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(title_slot_template, /*$$scope*/ ctx[12], dirty, get_title_slot_changes),
    						get_title_slot_context
    					);
    				}
    			} else {
    				if (title_slot_or_fallback && title_slot_or_fallback.p && (!current || dirty & /*title*/ 8)) {
    					title_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			if (subtitle_slot) {
    				if (subtitle_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						subtitle_slot,
    						subtitle_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(subtitle_slot_template, /*$$scope*/ ctx[12], dirty, get_subtitle_slot_changes),
    						get_subtitle_slot_context
    					);
    				}
    			} else {
    				if (subtitle_slot_or_fallback && subtitle_slot_or_fallback.p && (!current || dirty & /*subtitle*/ 16)) {
    					subtitle_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			if (actions_slot) {
    				if (actions_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						actions_slot,
    						actions_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(actions_slot_template, /*$$scope*/ ctx[12], dirty, get_actions_slot_changes),
    						get_actions_slot_context
    					);
    				}
    			}

    			if (!/*hideCloseButton*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*hideCloseButton*/ 32) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div3, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			set_attributes(div3, div3_data = get_spread_update(div3_levels, [
    				(!current || dirty & /*role*/ 4) && { role: /*role*/ ctx[2] },
    				(!current || dirty & /*kind*/ 1) && { kind: /*kind*/ ctx[0] },
    				dirty & /*$$restProps*/ 1024 && /*$$restProps*/ ctx[10]
    			]));

    			toggle_class(div3, "bx--inline-notification", true);
    			toggle_class(div3, "bx--inline-notification--low-contrast", /*lowContrast*/ ctx[1]);
    			toggle_class(div3, "bx--inline-notification--hide-close-button", /*hideCloseButton*/ ctx[5]);
    			toggle_class(div3, "bx--inline-notification--error", /*kind*/ ctx[0] === 'error');
    			toggle_class(div3, "bx--inline-notification--info", /*kind*/ ctx[0] === 'info');
    			toggle_class(div3, "bx--inline-notification--info-square", /*kind*/ ctx[0] === 'info-square');
    			toggle_class(div3, "bx--inline-notification--success", /*kind*/ ctx[0] === 'success');
    			toggle_class(div3, "bx--inline-notification--warning", /*kind*/ ctx[0] === 'warning');
    			toggle_class(div3, "bx--inline-notification--warning-alt", /*kind*/ ctx[0] === 'warning-alt');
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notificationicon.$$.fragment, local);
    			transition_in(title_slot_or_fallback, local);
    			transition_in(subtitle_slot_or_fallback, local);
    			transition_in(default_slot, local);
    			transition_in(actions_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notificationicon.$$.fragment, local);
    			transition_out(title_slot_or_fallback, local);
    			transition_out(subtitle_slot_or_fallback, local);
    			transition_out(default_slot, local);
    			transition_out(actions_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(notificationicon);
    			if (title_slot_or_fallback) title_slot_or_fallback.d(detaching);
    			if (subtitle_slot_or_fallback) subtitle_slot_or_fallback.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			if (actions_slot) actions_slot.d(detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(71:0) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (98:29) {title}
    function fallback_block_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*title*/ ctx[3]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 8) set_data_dev(t, /*title*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1$1.name,
    		type: "fallback",
    		source: "(98:29) {title}",
    		ctx
    	});

    	return block;
    }

    // (101:32) {subtitle}
    function fallback_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*subtitle*/ ctx[4]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*subtitle*/ 16) set_data_dev(t, /*subtitle*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(101:32) {subtitle}",
    		ctx
    	});

    	return block;
    }

    // (107:4) {#if !hideCloseButton}
    function create_if_block_1$2(ctx) {
    	let notificationbutton;
    	let current;

    	notificationbutton = new NotificationButton$1({
    			props: {
    				iconDescription: /*closeButtonDescription*/ ctx[7],
    				notificationType: "inline"
    			},
    			$$inline: true
    		});

    	notificationbutton.$on("click", /*close*/ ctx[9]);

    	const block = {
    		c: function create() {
    			create_component(notificationbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(notificationbutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const notificationbutton_changes = {};
    			if (dirty & /*closeButtonDescription*/ 128) notificationbutton_changes.iconDescription = /*closeButtonDescription*/ ctx[7];
    			notificationbutton.$set(notificationbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notificationbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notificationbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(notificationbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(107:4) {#if !hideCloseButton}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*open*/ ctx[8] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*open*/ ctx[8]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*open*/ 256) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"kind","lowContrast","timeout","role","title","subtitle","hideCloseButton","statusIconDescription","closeButtonDescription"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InlineNotification', slots, ['title','subtitle','default','actions']);
    	let { kind = "error" } = $$props;
    	let { lowContrast = false } = $$props;
    	let { timeout = 0 } = $$props;
    	let { role = "alert" } = $$props;
    	let { title = "" } = $$props;
    	let { subtitle = "" } = $$props;
    	let { hideCloseButton = false } = $$props;
    	let { statusIconDescription = kind + " icon" } = $$props;
    	let { closeButtonDescription = "Close notification" } = $$props;
    	const dispatch = createEventDispatcher();
    	let open = true;
    	let timeoutId = undefined;

    	function close(closeFromTimeout) {
    		const shouldContinue = dispatch("close", { timeout: closeFromTimeout === true }, { cancelable: true });

    		if (shouldContinue) {
    			$$invalidate(8, open = false);
    		}
    	}

    	onMount(() => {
    		if (timeout) {
    			timeoutId = setTimeout(() => close(true), timeout);
    		}

    		return () => {
    			clearTimeout(timeoutId);
    		};
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('kind' in $$new_props) $$invalidate(0, kind = $$new_props.kind);
    		if ('lowContrast' in $$new_props) $$invalidate(1, lowContrast = $$new_props.lowContrast);
    		if ('timeout' in $$new_props) $$invalidate(11, timeout = $$new_props.timeout);
    		if ('role' in $$new_props) $$invalidate(2, role = $$new_props.role);
    		if ('title' in $$new_props) $$invalidate(3, title = $$new_props.title);
    		if ('subtitle' in $$new_props) $$invalidate(4, subtitle = $$new_props.subtitle);
    		if ('hideCloseButton' in $$new_props) $$invalidate(5, hideCloseButton = $$new_props.hideCloseButton);
    		if ('statusIconDescription' in $$new_props) $$invalidate(6, statusIconDescription = $$new_props.statusIconDescription);
    		if ('closeButtonDescription' in $$new_props) $$invalidate(7, closeButtonDescription = $$new_props.closeButtonDescription);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		kind,
    		lowContrast,
    		timeout,
    		role,
    		title,
    		subtitle,
    		hideCloseButton,
    		statusIconDescription,
    		closeButtonDescription,
    		createEventDispatcher,
    		onMount,
    		NotificationIcon: NotificationIcon$1,
    		NotificationButton: NotificationButton$1,
    		dispatch,
    		open,
    		timeoutId,
    		close
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('kind' in $$props) $$invalidate(0, kind = $$new_props.kind);
    		if ('lowContrast' in $$props) $$invalidate(1, lowContrast = $$new_props.lowContrast);
    		if ('timeout' in $$props) $$invalidate(11, timeout = $$new_props.timeout);
    		if ('role' in $$props) $$invalidate(2, role = $$new_props.role);
    		if ('title' in $$props) $$invalidate(3, title = $$new_props.title);
    		if ('subtitle' in $$props) $$invalidate(4, subtitle = $$new_props.subtitle);
    		if ('hideCloseButton' in $$props) $$invalidate(5, hideCloseButton = $$new_props.hideCloseButton);
    		if ('statusIconDescription' in $$props) $$invalidate(6, statusIconDescription = $$new_props.statusIconDescription);
    		if ('closeButtonDescription' in $$props) $$invalidate(7, closeButtonDescription = $$new_props.closeButtonDescription);
    		if ('open' in $$props) $$invalidate(8, open = $$new_props.open);
    		if ('timeoutId' in $$props) timeoutId = $$new_props.timeoutId;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		kind,
    		lowContrast,
    		role,
    		title,
    		subtitle,
    		hideCloseButton,
    		statusIconDescription,
    		closeButtonDescription,
    		open,
    		close,
    		$$restProps,
    		timeout,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class InlineNotification extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			kind: 0,
    			lowContrast: 1,
    			timeout: 11,
    			role: 2,
    			title: 3,
    			subtitle: 4,
    			hideCloseButton: 5,
    			statusIconDescription: 6,
    			closeButtonDescription: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InlineNotification",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get kind() {
    		throw new Error("<InlineNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kind(value) {
    		throw new Error("<InlineNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lowContrast() {
    		throw new Error("<InlineNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lowContrast(value) {
    		throw new Error("<InlineNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get timeout() {
    		throw new Error("<InlineNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set timeout(value) {
    		throw new Error("<InlineNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get role() {
    		throw new Error("<InlineNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set role(value) {
    		throw new Error("<InlineNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<InlineNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<InlineNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subtitle() {
    		throw new Error("<InlineNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subtitle(value) {
    		throw new Error("<InlineNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideCloseButton() {
    		throw new Error("<InlineNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideCloseButton(value) {
    		throw new Error("<InlineNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get statusIconDescription() {
    		throw new Error("<InlineNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set statusIconDescription(value) {
    		throw new Error("<InlineNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeButtonDescription() {
    		throw new Error("<InlineNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeButtonDescription(value) {
    		throw new Error("<InlineNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var InlineNotification$1 = InlineNotification;

    /* node_modules/carbon-components-svelte/src/icons/EditOff.svelte generated by Svelte v3.55.1 */

    const file$2 = "node_modules/carbon-components-svelte/src/icons/EditOff.svelte";

    // (24:2) {#if title}
    function create_if_block$2(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$2, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let svg;
    	let path;
    	let if_block = /*title*/ ctx[1] && create_if_block$2(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path = svg_element("path");
    			attr_dev(path, "d", "M30 28.6L3.4 2 2 3.4l10.1 10.1L4 21.6V28h6.4l8.1-8.1L28.6 30 30 28.6zM9.6 26H6v-3.6l7.5-7.5 3.6 3.6L9.6 26zM29.4 6.2L29.4 6.2l-3.6-3.6c-.8-.8-2-.8-2.8 0l0 0 0 0-8 8 1.4 1.4L20 8.4l3.6 3.6L20 15.6l1.4 1.4 8-8C30.2 8.2 30.2 7 29.4 6.2L29.4 6.2zM25 10.6L21.4 7l3-3L28 7.6 25 10.6z");
    			add_location(path, file$2, 24, 2, 579);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$2, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(svg, path);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EditOff', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class EditOff extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditOff",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get size() {
    		throw new Error("<EditOff>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<EditOff>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<EditOff>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<EditOff>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var EditOff$1 = EditOff;

    /* node_modules/carbon-components-svelte/src/TextInput/TextInput.svelte generated by Svelte v3.55.1 */
    const file$1 = "node_modules/carbon-components-svelte/src/TextInput/TextInput.svelte";
    const get_labelText_slot_changes_1 = dirty => ({});
    const get_labelText_slot_context_1 = ctx => ({});
    const get_labelText_slot_changes = dirty => ({});
    const get_labelText_slot_context = ctx => ({});

    // (117:2) {#if inline}
    function create_if_block_10(ctx) {
    	let div;
    	let t;
    	let current;
    	let if_block0 = /*labelText*/ ctx[9] && create_if_block_12(ctx);
    	let if_block1 = !/*isFluid*/ ctx[22] && /*helperText*/ ctx[6] && create_if_block_11(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			toggle_class(div, "bx--text-input__label-helper-wrapper", true);
    			add_location(div, file$1, 117, 4, 2963);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*labelText*/ ctx[9]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*labelText*/ 512) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_12(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*isFluid*/ ctx[22] && /*helperText*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_11(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(117:2) {#if inline}",
    		ctx
    	});

    	return block;
    }

    // (119:6) {#if labelText}
    function create_if_block_12(ctx) {
    	let label;
    	let current;
    	const labelText_slot_template = /*#slots*/ ctx[28].labelText;
    	const labelText_slot = create_slot(labelText_slot_template, ctx, /*$$scope*/ ctx[27], get_labelText_slot_context);
    	const labelText_slot_or_fallback = labelText_slot || fallback_block_1(ctx);

    	const block = {
    		c: function create() {
    			label = element("label");
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.c();
    			attr_dev(label, "for", /*id*/ ctx[7]);
    			toggle_class(label, "bx--label", true);
    			toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[10]);
    			toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[5]);
    			toggle_class(label, "bx--label--inline", /*inline*/ ctx[16]);
    			toggle_class(label, "bx--label--inline--sm", /*size*/ ctx[2] === 'sm');
    			toggle_class(label, "bx--label--inline--xl", /*size*/ ctx[2] === 'xl');
    			add_location(label, file$1, 119, 8, 3051);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);

    			if (labelText_slot_or_fallback) {
    				labelText_slot_or_fallback.m(label, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (labelText_slot) {
    				if (labelText_slot.p && (!current || dirty[0] & /*$$scope*/ 134217728)) {
    					update_slot_base(
    						labelText_slot,
    						labelText_slot_template,
    						ctx,
    						/*$$scope*/ ctx[27],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[27])
    						: get_slot_changes(labelText_slot_template, /*$$scope*/ ctx[27], dirty, get_labelText_slot_changes),
    						get_labelText_slot_context
    					);
    				}
    			} else {
    				if (labelText_slot_or_fallback && labelText_slot_or_fallback.p && (!current || dirty[0] & /*labelText*/ 512)) {
    					labelText_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*id*/ 128) {
    				attr_dev(label, "for", /*id*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*hideLabel*/ 1024) {
    				toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[10]);
    			}

    			if (!current || dirty[0] & /*disabled*/ 32) {
    				toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[5]);
    			}

    			if (!current || dirty[0] & /*inline*/ 65536) {
    				toggle_class(label, "bx--label--inline", /*inline*/ ctx[16]);
    			}

    			if (!current || dirty[0] & /*size*/ 4) {
    				toggle_class(label, "bx--label--inline--sm", /*size*/ ctx[2] === 'sm');
    			}

    			if (!current || dirty[0] & /*size*/ 4) {
    				toggle_class(label, "bx--label--inline--xl", /*size*/ ctx[2] === 'xl');
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(labelText_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(labelText_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(119:6) {#if labelText}",
    		ctx
    	});

    	return block;
    }

    // (129:33)
    function fallback_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*labelText*/ ctx[9]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*labelText*/ 512) set_data_dev(t, /*labelText*/ ctx[9]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(129:33)              ",
    		ctx
    	});

    	return block;
    }

    // (134:6) {#if !isFluid && helperText}
    function create_if_block_11(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*helperText*/ ctx[6]);
    			toggle_class(div, "bx--form__helper-text", true);
    			toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[5]);
    			toggle_class(div, "bx--form__helper-text--inline", /*inline*/ ctx[16]);
    			add_location(div, file$1, 134, 8, 3528);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*helperText*/ 64) set_data_dev(t, /*helperText*/ ctx[6]);

    			if (dirty[0] & /*disabled*/ 32) {
    				toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[5]);
    			}

    			if (dirty[0] & /*inline*/ 65536) {
    				toggle_class(div, "bx--form__helper-text--inline", /*inline*/ ctx[16]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(134:6) {#if !isFluid && helperText}",
    		ctx
    	});

    	return block;
    }

    // (145:2) {#if !inline && (labelText || $$slots.labelText)}
    function create_if_block_9(ctx) {
    	let label;
    	let current;
    	const labelText_slot_template = /*#slots*/ ctx[28].labelText;
    	const labelText_slot = create_slot(labelText_slot_template, ctx, /*$$scope*/ ctx[27], get_labelText_slot_context_1);
    	const labelText_slot_or_fallback = labelText_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			label = element("label");
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.c();
    			attr_dev(label, "for", /*id*/ ctx[7]);
    			toggle_class(label, "bx--label", true);
    			toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[10]);
    			toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[5]);
    			toggle_class(label, "bx--label--inline", /*inline*/ ctx[16]);
    			toggle_class(label, "bx--label--inline-sm", /*inline*/ ctx[16] && /*size*/ ctx[2] === 'sm');
    			toggle_class(label, "bx--label--inline-xl", /*inline*/ ctx[16] && /*size*/ ctx[2] === 'xl');
    			add_location(label, file$1, 145, 4, 3833);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);

    			if (labelText_slot_or_fallback) {
    				labelText_slot_or_fallback.m(label, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (labelText_slot) {
    				if (labelText_slot.p && (!current || dirty[0] & /*$$scope*/ 134217728)) {
    					update_slot_base(
    						labelText_slot,
    						labelText_slot_template,
    						ctx,
    						/*$$scope*/ ctx[27],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[27])
    						: get_slot_changes(labelText_slot_template, /*$$scope*/ ctx[27], dirty, get_labelText_slot_changes_1),
    						get_labelText_slot_context_1
    					);
    				}
    			} else {
    				if (labelText_slot_or_fallback && labelText_slot_or_fallback.p && (!current || dirty[0] & /*labelText*/ 512)) {
    					labelText_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*id*/ 128) {
    				attr_dev(label, "for", /*id*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*hideLabel*/ 1024) {
    				toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[10]);
    			}

    			if (!current || dirty[0] & /*disabled*/ 32) {
    				toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[5]);
    			}

    			if (!current || dirty[0] & /*inline*/ 65536) {
    				toggle_class(label, "bx--label--inline", /*inline*/ ctx[16]);
    			}

    			if (!current || dirty[0] & /*inline, size*/ 65540) {
    				toggle_class(label, "bx--label--inline-sm", /*inline*/ ctx[16] && /*size*/ ctx[2] === 'sm');
    			}

    			if (!current || dirty[0] & /*inline, size*/ 65540) {
    				toggle_class(label, "bx--label--inline-xl", /*inline*/ ctx[16] && /*size*/ ctx[2] === 'xl');
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(labelText_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(labelText_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(145:2) {#if !inline && (labelText || $$slots.labelText)}",
    		ctx
    	});

    	return block;
    }

    // (155:29)
    function fallback_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*labelText*/ ctx[9]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*labelText*/ 512) set_data_dev(t, /*labelText*/ ctx[9]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(155:29)          ",
    		ctx
    	});

    	return block;
    }

    // (172:6) {:else}
    function create_else_block$1(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*invalid*/ ctx[11] && create_if_block_8(ctx);
    	let if_block1 = !/*invalid*/ ctx[11] && /*warn*/ ctx[13] && create_if_block_7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*invalid*/ ctx[11]) {
    				if (if_block0) {
    					if (dirty[0] & /*invalid*/ 2048) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_8(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*invalid*/ ctx[11] && /*warn*/ ctx[13]) {
    				if (if_block1) {
    					if (dirty[0] & /*invalid, warn*/ 10240) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_7(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(172:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (170:6) {#if readonly}
    function create_if_block_6(ctx) {
    	let editoff;
    	let current;

    	editoff = new EditOff$1({
    			props: { class: "bx--text-input__readonly-icon" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(editoff.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(editoff, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(editoff.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(editoff.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(editoff, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(170:6) {#if readonly}",
    		ctx
    	});

    	return block;
    }

    // (173:8) {#if invalid}
    function create_if_block_8(ctx) {
    	let warningfilled;
    	let current;

    	warningfilled = new WarningFilled$1({
    			props: { class: "bx--text-input__invalid-icon" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warningfilled.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(warningfilled, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warningfilled.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warningfilled.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warningfilled, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(173:8) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (176:8) {#if !invalid && warn}
    function create_if_block_7(ctx) {
    	let warningaltfilled;
    	let current;

    	warningaltfilled = new WarningAltFilled$1({
    			props: {
    				class: "bx--text-input__invalid-icon\n            bx--text-input__invalid-icon--warning"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warningaltfilled.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(warningaltfilled, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warningaltfilled.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warningaltfilled.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warningaltfilled, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(176:8) {#if !invalid && warn}",
    		ctx
    	});

    	return block;
    }

    // (217:6) {#if isFluid}
    function create_if_block_5(ctx) {
    	let hr;

    	const block = {
    		c: function create() {
    			hr = element("hr");
    			toggle_class(hr, "bx--text-input__divider", true);
    			add_location(hr, file$1, 217, 8, 5968);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, hr, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(hr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(217:6) {#if isFluid}",
    		ctx
    	});

    	return block;
    }

    // (220:6) {#if isFluid && !inline && invalid}
    function create_if_block_4(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*invalidText*/ ctx[12]);
    			attr_dev(div, "id", /*errorId*/ ctx[19]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$1, 220, 8, 6076);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*invalidText*/ 4096) set_data_dev(t, /*invalidText*/ ctx[12]);

    			if (dirty[0] & /*errorId*/ 524288) {
    				attr_dev(div, "id", /*errorId*/ ctx[19]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(220:6) {#if isFluid && !inline && invalid}",
    		ctx
    	});

    	return block;
    }

    // (225:6) {#if isFluid && !inline && warn}
    function create_if_block_3(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*warnText*/ ctx[14]);
    			attr_dev(div, "id", /*warnId*/ ctx[18]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$1, 225, 8, 6231);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*warnText*/ 16384) set_data_dev(t, /*warnText*/ ctx[14]);

    			if (dirty[0] & /*warnId*/ 262144) {
    				attr_dev(div, "id", /*warnId*/ ctx[18]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(225:6) {#if isFluid && !inline && warn}",
    		ctx
    	});

    	return block;
    }

    // (229:4) {#if !invalid && !warn && !isFluid && !inline && helperText}
    function create_if_block_2$1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*helperText*/ ctx[6]);
    			attr_dev(div, "id", /*helperId*/ ctx[20]);
    			toggle_class(div, "bx--form__helper-text", true);
    			toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[5]);
    			toggle_class(div, "bx--form__helper-text--inline", /*inline*/ ctx[16]);
    			add_location(div, file$1, 229, 6, 6397);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*helperText*/ 64) set_data_dev(t, /*helperText*/ ctx[6]);

    			if (dirty[0] & /*helperId*/ 1048576) {
    				attr_dev(div, "id", /*helperId*/ ctx[20]);
    			}

    			if (dirty[0] & /*disabled*/ 32) {
    				toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[5]);
    			}

    			if (dirty[0] & /*inline*/ 65536) {
    				toggle_class(div, "bx--form__helper-text--inline", /*inline*/ ctx[16]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(229:4) {#if !invalid && !warn && !isFluid && !inline && helperText}",
    		ctx
    	});

    	return block;
    }

    // (239:4) {#if !isFluid && invalid}
    function create_if_block_1$1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*invalidText*/ ctx[12]);
    			attr_dev(div, "id", /*errorId*/ ctx[19]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$1, 239, 6, 6673);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*invalidText*/ 4096) set_data_dev(t, /*invalidText*/ ctx[12]);

    			if (dirty[0] & /*errorId*/ 524288) {
    				attr_dev(div, "id", /*errorId*/ ctx[19]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(239:4) {#if !isFluid && invalid}",
    		ctx
    	});

    	return block;
    }

    // (244:4) {#if !isFluid && !invalid && warn}
    function create_if_block$1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*warnText*/ ctx[14]);
    			attr_dev(div, "id", /*warnId*/ ctx[18]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$1, 244, 6, 6820);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*warnText*/ 16384) set_data_dev(t, /*warnText*/ ctx[14]);

    			if (dirty[0] & /*warnId*/ 262144) {
    				attr_dev(div, "id", /*warnId*/ ctx[18]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(244:4) {#if !isFluid && !invalid && warn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div2;
    	let t0;
    	let t1;
    	let div1;
    	let div0;
    	let current_block_type_index;
    	let if_block2;
    	let t2;
    	let input;
    	let input_data_invalid_value;
    	let input_aria_invalid_value;
    	let input_data_warn_value;
    	let input_aria_describedby_value;
    	let t3;
    	let t4;
    	let t5;
    	let div0_data_invalid_value;
    	let div0_data_warn_value;
    	let t6;
    	let t7;
    	let t8;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*inline*/ ctx[16] && create_if_block_10(ctx);
    	let if_block1 = !/*inline*/ ctx[16] && (/*labelText*/ ctx[9] || /*$$slots*/ ctx[26].labelText) && create_if_block_9(ctx);
    	const if_block_creators = [create_if_block_6, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*readonly*/ ctx[17]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let input_levels = [
    		{
    			"data-invalid": input_data_invalid_value = /*error*/ ctx[21] || undefined
    		},
    		{
    			"aria-invalid": input_aria_invalid_value = /*error*/ ctx[21] || undefined
    		},
    		{
    			"data-warn": input_data_warn_value = /*warn*/ ctx[13] || undefined
    		},
    		{
    			"aria-describedby": input_aria_describedby_value = /*error*/ ctx[21]
    			? /*errorId*/ ctx[19]
    			: /*warn*/ ctx[13]
    				? /*warnId*/ ctx[18]
    				: /*helperText*/ ctx[6] ? /*helperId*/ ctx[20] : undefined
    		},
    		{ disabled: /*disabled*/ ctx[5] },
    		{ id: /*id*/ ctx[7] },
    		{ name: /*name*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[3] },
    		{ required: /*required*/ ctx[15] },
    		{ readOnly: /*readonly*/ ctx[17] },
    		/*$$restProps*/ ctx[25]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	let if_block3 = /*isFluid*/ ctx[22] && create_if_block_5(ctx);
    	let if_block4 = /*isFluid*/ ctx[22] && !/*inline*/ ctx[16] && /*invalid*/ ctx[11] && create_if_block_4(ctx);
    	let if_block5 = /*isFluid*/ ctx[22] && !/*inline*/ ctx[16] && /*warn*/ ctx[13] && create_if_block_3(ctx);
    	let if_block6 = !/*invalid*/ ctx[11] && !/*warn*/ ctx[13] && !/*isFluid*/ ctx[22] && !/*inline*/ ctx[16] && /*helperText*/ ctx[6] && create_if_block_2$1(ctx);
    	let if_block7 = !/*isFluid*/ ctx[22] && /*invalid*/ ctx[11] && create_if_block_1$1(ctx);
    	let if_block8 = !/*isFluid*/ ctx[22] && !/*invalid*/ ctx[11] && /*warn*/ ctx[13] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			if_block2.c();
    			t2 = space();
    			input = element("input");
    			t3 = space();
    			if (if_block3) if_block3.c();
    			t4 = space();
    			if (if_block4) if_block4.c();
    			t5 = space();
    			if (if_block5) if_block5.c();
    			t6 = space();
    			if (if_block6) if_block6.c();
    			t7 = space();
    			if (if_block7) if_block7.c();
    			t8 = space();
    			if (if_block8) if_block8.c();
    			set_attributes(input, input_data);
    			toggle_class(input, "bx--text-input", true);
    			toggle_class(input, "bx--text-input--light", /*light*/ ctx[4]);
    			toggle_class(input, "bx--text-input--invalid", /*error*/ ctx[21]);
    			toggle_class(input, "bx--text-input--warn", /*warn*/ ctx[13]);
    			toggle_class(input, "bx--text-input--sm", /*size*/ ctx[2] === 'sm');
    			toggle_class(input, "bx--text-input--xl", /*size*/ ctx[2] === 'xl');
    			add_location(input, file$1, 182, 6, 4979);
    			attr_dev(div0, "data-invalid", div0_data_invalid_value = /*error*/ ctx[21] || undefined);
    			attr_dev(div0, "data-warn", div0_data_warn_value = /*warn*/ ctx[13] || undefined);
    			toggle_class(div0, "bx--text-input__field-wrapper", true);
    			toggle_class(div0, "bx--text-input__field-wrapper--warning", !/*invalid*/ ctx[11] && /*warn*/ ctx[13]);
    			add_location(div0, file$1, 163, 4, 4368);
    			toggle_class(div1, "bx--text-input__field-outer-wrapper", true);
    			toggle_class(div1, "bx--text-input__field-outer-wrapper--inline", /*inline*/ ctx[16]);
    			add_location(div1, file$1, 159, 2, 4235);
    			toggle_class(div2, "bx--form-item", true);
    			toggle_class(div2, "bx--text-input-wrapper", true);
    			toggle_class(div2, "bx--text-input-wrapper--inline", /*inline*/ ctx[16]);
    			toggle_class(div2, "bx--text-input-wrapper--light", /*light*/ ctx[4]);
    			toggle_class(div2, "bx--text-input-wrapper--readonly", /*readonly*/ ctx[17]);
    			add_location(div2, file$1, 105, 0, 2656);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div2, t0);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div0, t2);
    			append_dev(div0, input);
    			if (input.autofocus) input.focus();
    			/*input_binding*/ ctx[38](input);
    			set_input_value(input, /*value*/ ctx[0]);
    			append_dev(div0, t3);
    			if (if_block3) if_block3.m(div0, null);
    			append_dev(div0, t4);
    			if (if_block4) if_block4.m(div0, null);
    			append_dev(div0, t5);
    			if (if_block5) if_block5.m(div0, null);
    			append_dev(div1, t6);
    			if (if_block6) if_block6.m(div1, null);
    			append_dev(div1, t7);
    			if (if_block7) if_block7.m(div1, null);
    			append_dev(div1, t8);
    			if (if_block8) if_block8.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[39]),
    					listen_dev(input, "change", /*onChange*/ ctx[24], false, false, false),
    					listen_dev(input, "input", /*onInput*/ ctx[23], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler*/ ctx[33], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler*/ ctx[34], false, false, false),
    					listen_dev(input, "focus", /*focus_handler*/ ctx[35], false, false, false),
    					listen_dev(input, "blur", /*blur_handler*/ ctx[36], false, false, false),
    					listen_dev(input, "paste", /*paste_handler*/ ctx[37], false, false, false),
    					listen_dev(div2, "click", /*click_handler*/ ctx[29], false, false, false),
    					listen_dev(div2, "mouseover", /*mouseover_handler*/ ctx[30], false, false, false),
    					listen_dev(div2, "mouseenter", /*mouseenter_handler*/ ctx[31], false, false, false),
    					listen_dev(div2, "mouseleave", /*mouseleave_handler*/ ctx[32], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*inline*/ ctx[16]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*inline*/ 65536) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_10(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div2, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*inline*/ ctx[16] && (/*labelText*/ ctx[9] || /*$$slots*/ ctx[26].labelText)) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*inline, labelText, $$slots*/ 67174912) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_9(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div2, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block2 = if_blocks[current_block_type_index];

    				if (!if_block2) {
    					if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block2.c();
    				} else {
    					if_block2.p(ctx, dirty);
    				}

    				transition_in(if_block2, 1);
    				if_block2.m(div0, t2);
    			}

    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				(!current || dirty[0] & /*error*/ 2097152 && input_data_invalid_value !== (input_data_invalid_value = /*error*/ ctx[21] || undefined)) && { "data-invalid": input_data_invalid_value },
    				(!current || dirty[0] & /*error*/ 2097152 && input_aria_invalid_value !== (input_aria_invalid_value = /*error*/ ctx[21] || undefined)) && { "aria-invalid": input_aria_invalid_value },
    				(!current || dirty[0] & /*warn*/ 8192 && input_data_warn_value !== (input_data_warn_value = /*warn*/ ctx[13] || undefined)) && { "data-warn": input_data_warn_value },
    				(!current || dirty[0] & /*error, errorId, warn, warnId, helperText, helperId*/ 3940416 && input_aria_describedby_value !== (input_aria_describedby_value = /*error*/ ctx[21]
    				? /*errorId*/ ctx[19]
    				: /*warn*/ ctx[13]
    					? /*warnId*/ ctx[18]
    					: /*helperText*/ ctx[6] ? /*helperId*/ ctx[20] : undefined)) && {
    					"aria-describedby": input_aria_describedby_value
    				},
    				(!current || dirty[0] & /*disabled*/ 32) && { disabled: /*disabled*/ ctx[5] },
    				(!current || dirty[0] & /*id*/ 128) && { id: /*id*/ ctx[7] },
    				(!current || dirty[0] & /*name*/ 256) && { name: /*name*/ ctx[8] },
    				(!current || dirty[0] & /*placeholder*/ 8) && { placeholder: /*placeholder*/ ctx[3] },
    				(!current || dirty[0] & /*required*/ 32768) && { required: /*required*/ ctx[15] },
    				(!current || dirty[0] & /*readonly*/ 131072) && { readOnly: /*readonly*/ ctx[17] },
    				dirty[0] & /*$$restProps*/ 33554432 && /*$$restProps*/ ctx[25]
    			]));

    			if (dirty[0] & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			toggle_class(input, "bx--text-input", true);
    			toggle_class(input, "bx--text-input--light", /*light*/ ctx[4]);
    			toggle_class(input, "bx--text-input--invalid", /*error*/ ctx[21]);
    			toggle_class(input, "bx--text-input--warn", /*warn*/ ctx[13]);
    			toggle_class(input, "bx--text-input--sm", /*size*/ ctx[2] === 'sm');
    			toggle_class(input, "bx--text-input--xl", /*size*/ ctx[2] === 'xl');

    			if (/*isFluid*/ ctx[22]) {
    				if (if_block3) ; else {
    					if_block3 = create_if_block_5(ctx);
    					if_block3.c();
    					if_block3.m(div0, t4);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*isFluid*/ ctx[22] && !/*inline*/ ctx[16] && /*invalid*/ ctx[11]) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_4(ctx);
    					if_block4.c();
    					if_block4.m(div0, t5);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*isFluid*/ ctx[22] && !/*inline*/ ctx[16] && /*warn*/ ctx[13]) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_3(ctx);
    					if_block5.c();
    					if_block5.m(div0, null);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (!current || dirty[0] & /*error*/ 2097152 && div0_data_invalid_value !== (div0_data_invalid_value = /*error*/ ctx[21] || undefined)) {
    				attr_dev(div0, "data-invalid", div0_data_invalid_value);
    			}

    			if (!current || dirty[0] & /*warn*/ 8192 && div0_data_warn_value !== (div0_data_warn_value = /*warn*/ ctx[13] || undefined)) {
    				attr_dev(div0, "data-warn", div0_data_warn_value);
    			}

    			if (!current || dirty[0] & /*invalid, warn*/ 10240) {
    				toggle_class(div0, "bx--text-input__field-wrapper--warning", !/*invalid*/ ctx[11] && /*warn*/ ctx[13]);
    			}

    			if (!/*invalid*/ ctx[11] && !/*warn*/ ctx[13] && !/*isFluid*/ ctx[22] && !/*inline*/ ctx[16] && /*helperText*/ ctx[6]) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_2$1(ctx);
    					if_block6.c();
    					if_block6.m(div1, t7);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (!/*isFluid*/ ctx[22] && /*invalid*/ ctx[11]) {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);
    				} else {
    					if_block7 = create_if_block_1$1(ctx);
    					if_block7.c();
    					if_block7.m(div1, t8);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			if (!/*isFluid*/ ctx[22] && !/*invalid*/ ctx[11] && /*warn*/ ctx[13]) {
    				if (if_block8) {
    					if_block8.p(ctx, dirty);
    				} else {
    					if_block8 = create_if_block$1(ctx);
    					if_block8.c();
    					if_block8.m(div1, null);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}

    			if (!current || dirty[0] & /*inline*/ 65536) {
    				toggle_class(div1, "bx--text-input__field-outer-wrapper--inline", /*inline*/ ctx[16]);
    			}

    			if (!current || dirty[0] & /*inline*/ 65536) {
    				toggle_class(div2, "bx--text-input-wrapper--inline", /*inline*/ ctx[16]);
    			}

    			if (!current || dirty[0] & /*light*/ 16) {
    				toggle_class(div2, "bx--text-input-wrapper--light", /*light*/ ctx[4]);
    			}

    			if (!current || dirty[0] & /*readonly*/ 131072) {
    				toggle_class(div2, "bx--text-input-wrapper--readonly", /*readonly*/ ctx[17]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if_blocks[current_block_type_index].d();
    			/*input_binding*/ ctx[38](null);
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			if (if_block8) if_block8.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let isFluid;
    	let error;
    	let helperId;
    	let errorId;
    	let warnId;

    	const omit_props_names = [
    		"size","value","placeholder","light","disabled","helperText","id","name","labelText","hideLabel","invalid","invalidText","warn","warnText","ref","required","inline","readonly"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TextInput', slots, ['labelText']);
    	const $$slots = compute_slots(slots);
    	let { size = undefined } = $$props;
    	let { value = "" } = $$props;
    	let { placeholder = "" } = $$props;
    	let { light = false } = $$props;
    	let { disabled = false } = $$props;
    	let { helperText = "" } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { name = undefined } = $$props;
    	let { labelText = "" } = $$props;
    	let { hideLabel = false } = $$props;
    	let { invalid = false } = $$props;
    	let { invalidText = "" } = $$props;
    	let { warn = false } = $$props;
    	let { warnText = "" } = $$props;
    	let { ref = null } = $$props;
    	let { required = false } = $$props;
    	let { inline = false } = $$props;
    	let { readonly = false } = $$props;
    	const ctx = getContext("Form");
    	const dispatch = createEventDispatcher();

    	function parse(raw) {
    		if ($$restProps.type !== "number") return raw;
    		return raw != "" ? Number(raw) : null;
    	}

    	/** @type {(e: Event) => void} */
    	const onInput = e => {
    		$$invalidate(0, value = parse(e.target.value));
    		dispatch("input", value);
    	};

    	/** @type {(e: Event) => void} */
    	const onChange = e => {
    		dispatch("change", parse(e.target.value));
    	};

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function paste_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(25, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(2, size = $$new_props.size);
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('placeholder' in $$new_props) $$invalidate(3, placeholder = $$new_props.placeholder);
    		if ('light' in $$new_props) $$invalidate(4, light = $$new_props.light);
    		if ('disabled' in $$new_props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ('helperText' in $$new_props) $$invalidate(6, helperText = $$new_props.helperText);
    		if ('id' in $$new_props) $$invalidate(7, id = $$new_props.id);
    		if ('name' in $$new_props) $$invalidate(8, name = $$new_props.name);
    		if ('labelText' in $$new_props) $$invalidate(9, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$new_props) $$invalidate(10, hideLabel = $$new_props.hideLabel);
    		if ('invalid' in $$new_props) $$invalidate(11, invalid = $$new_props.invalid);
    		if ('invalidText' in $$new_props) $$invalidate(12, invalidText = $$new_props.invalidText);
    		if ('warn' in $$new_props) $$invalidate(13, warn = $$new_props.warn);
    		if ('warnText' in $$new_props) $$invalidate(14, warnText = $$new_props.warnText);
    		if ('ref' in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    		if ('required' in $$new_props) $$invalidate(15, required = $$new_props.required);
    		if ('inline' in $$new_props) $$invalidate(16, inline = $$new_props.inline);
    		if ('readonly' in $$new_props) $$invalidate(17, readonly = $$new_props.readonly);
    		if ('$$scope' in $$new_props) $$invalidate(27, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		size,
    		value,
    		placeholder,
    		light,
    		disabled,
    		helperText,
    		id,
    		name,
    		labelText,
    		hideLabel,
    		invalid,
    		invalidText,
    		warn,
    		warnText,
    		ref,
    		required,
    		inline,
    		readonly,
    		createEventDispatcher,
    		getContext,
    		WarningFilled: WarningFilled$1,
    		WarningAltFilled: WarningAltFilled$1,
    		EditOff: EditOff$1,
    		ctx,
    		dispatch,
    		parse,
    		onInput,
    		onChange,
    		warnId,
    		errorId,
    		helperId,
    		error,
    		isFluid
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('size' in $$props) $$invalidate(2, size = $$new_props.size);
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('placeholder' in $$props) $$invalidate(3, placeholder = $$new_props.placeholder);
    		if ('light' in $$props) $$invalidate(4, light = $$new_props.light);
    		if ('disabled' in $$props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ('helperText' in $$props) $$invalidate(6, helperText = $$new_props.helperText);
    		if ('id' in $$props) $$invalidate(7, id = $$new_props.id);
    		if ('name' in $$props) $$invalidate(8, name = $$new_props.name);
    		if ('labelText' in $$props) $$invalidate(9, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$props) $$invalidate(10, hideLabel = $$new_props.hideLabel);
    		if ('invalid' in $$props) $$invalidate(11, invalid = $$new_props.invalid);
    		if ('invalidText' in $$props) $$invalidate(12, invalidText = $$new_props.invalidText);
    		if ('warn' in $$props) $$invalidate(13, warn = $$new_props.warn);
    		if ('warnText' in $$props) $$invalidate(14, warnText = $$new_props.warnText);
    		if ('ref' in $$props) $$invalidate(1, ref = $$new_props.ref);
    		if ('required' in $$props) $$invalidate(15, required = $$new_props.required);
    		if ('inline' in $$props) $$invalidate(16, inline = $$new_props.inline);
    		if ('readonly' in $$props) $$invalidate(17, readonly = $$new_props.readonly);
    		if ('warnId' in $$props) $$invalidate(18, warnId = $$new_props.warnId);
    		if ('errorId' in $$props) $$invalidate(19, errorId = $$new_props.errorId);
    		if ('helperId' in $$props) $$invalidate(20, helperId = $$new_props.helperId);
    		if ('error' in $$props) $$invalidate(21, error = $$new_props.error);
    		if ('isFluid' in $$props) $$invalidate(22, isFluid = $$new_props.isFluid);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*invalid, readonly*/ 133120) {
    			$$invalidate(21, error = invalid && !readonly);
    		}

    		if ($$self.$$.dirty[0] & /*id*/ 128) {
    			$$invalidate(20, helperId = `helper-${id}`);
    		}

    		if ($$self.$$.dirty[0] & /*id*/ 128) {
    			$$invalidate(19, errorId = `error-${id}`);
    		}

    		if ($$self.$$.dirty[0] & /*id*/ 128) {
    			$$invalidate(18, warnId = `warn-${id}`);
    		}
    	};

    	$$invalidate(22, isFluid = !!ctx && ctx.isFluid);

    	return [
    		value,
    		ref,
    		size,
    		placeholder,
    		light,
    		disabled,
    		helperText,
    		id,
    		name,
    		labelText,
    		hideLabel,
    		invalid,
    		invalidText,
    		warn,
    		warnText,
    		required,
    		inline,
    		readonly,
    		warnId,
    		errorId,
    		helperId,
    		error,
    		isFluid,
    		onInput,
    		onChange,
    		$$restProps,
    		$$slots,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keydown_handler,
    		keyup_handler,
    		focus_handler,
    		blur_handler,
    		paste_handler,
    		input_binding,
    		input_input_handler
    	];
    }

    class TextInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$1,
    			create_fragment$1,
    			safe_not_equal,
    			{
    				size: 2,
    				value: 0,
    				placeholder: 3,
    				light: 4,
    				disabled: 5,
    				helperText: 6,
    				id: 7,
    				name: 8,
    				labelText: 9,
    				hideLabel: 10,
    				invalid: 11,
    				invalidText: 12,
    				warn: 13,
    				warnText: 14,
    				ref: 1,
    				required: 15,
    				inline: 16,
    				readonly: 17
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextInput",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get size() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperText() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperText(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelText() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelText(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideLabel() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideLabel(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalidText() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalidText(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warn() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warn(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warnText() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warnText(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get required() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set required(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inline() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inline(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readonly() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readonly(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var TextInput$1 = TextInput;

    /* src/PatientManagement.svelte generated by Svelte v3.55.1 */

    const { Object: Object_1 } = globals;

    const file = "src/PatientManagement.svelte";

    // (186:4) <Button on:click={() => (open = true)}>
    function create_default_slot_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Create patient");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(186:4) <Button on:click={() => (open = true)}>",
    		ctx
    	});

    	return block;
    }

    // (175:4) <ToolbarContent>
    function create_default_slot_5(ctx) {
    	let toolbarsearch;
    	let t;
    	let button;
    	let current;
    	toolbarsearch = new ToolbarSearch$1({ $$inline: true });

    	button = new Button$1({
    			props: {
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler*/ ctx[12]);

    	const block = {
    		c: function create() {
    			create_component(toolbarsearch.$$.fragment);
    			t = space();
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(toolbarsearch, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 67108864) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toolbarsearch.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toolbarsearch.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(toolbarsearch, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(175:4) <ToolbarContent>",
    		ctx
    	});

    	return block;
    }

    // (174:2) <Toolbar>
    function create_default_slot_4(ctx) {
    	let toolbarcontent;
    	let current;

    	toolbarcontent = new ToolbarContent$1({
    			props: {
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(toolbarcontent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(toolbarcontent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const toolbarcontent_changes = {};

    			if (dirty & /*$$scope, open*/ 67108865) {
    				toolbarcontent_changes.$$scope = { dirty, ctx };
    			}

    			toolbarcontent.$set(toolbarcontent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toolbarcontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toolbarcontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(toolbarcontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(174:2) <Toolbar>",
    		ctx
    	});

    	return block;
    }

    // (157:4) <DataTable     title="Patient management"     sortable     zebra     stickHeader     description="{patient_count} patient(s) found"     {headers}     {rows}>
    function create_default_slot_3(ctx) {
    	let toolbar;
    	let current;

    	toolbar = new Toolbar$1({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(toolbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(toolbar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const toolbar_changes = {};

    			if (dirty & /*$$scope, open*/ 67108865) {
    				toolbar_changes.$$scope = { dirty, ctx };
    			}

    			toolbar.$set(toolbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toolbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toolbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(toolbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(157:4) <DataTable     title=\\\"Patient management\\\"     sortable     zebra     stickHeader     description=\\\"{patient_count} patient(s) found\\\"     {headers}     {rows}>",
    		ctx
    	});

    	return block;
    }

    // (171:8) {:else}
    function create_else_block(ctx) {
    	let t_value = /*cell*/ ctx[24].value + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cell*/ 16777216 && t_value !== (t_value = /*cell*/ ctx[24].value + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(171:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (166:8) {#if cell.key === "overflow"}
    function create_if_block_2(ctx) {
    	let overflowmenu;
    	let current;

    	overflowmenu = new OverflowMenu$1({
    			props: {
    				flipped: true,
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(overflowmenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(overflowmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const overflowmenu_changes = {};

    			if (dirty & /*$$scope, row*/ 100663296) {
    				overflowmenu_changes.$$scope = { dirty, ctx };
    			}

    			overflowmenu.$set(overflowmenu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overflowmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overflowmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(overflowmenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(166:8) {#if cell.key === \\\"overflow\\\"}",
    		ctx
    	});

    	return block;
    }

    // (167:10) <OverflowMenu flipped>
    function create_default_slot_2(ctx) {
    	let overflowmenuitem0;
    	let t;
    	let overflowmenuitem1;
    	let current;

    	overflowmenuitem0 = new OverflowMenuItem$1({
    			props: { text: "View resources" },
    			$$inline: true
    		});

    	overflowmenuitem0.$on("click", function () {
    		if (is_function(viewResource(/*row*/ ctx[25]['id']))) viewResource(/*row*/ ctx[25]['id']).apply(this, arguments);
    	});

    	overflowmenuitem1 = new OverflowMenuItem$1({
    			props: { danger: true, text: "Delete" },
    			$$inline: true
    		});

    	overflowmenuitem1.$on("click", function () {
    		if (is_function(handlePatientDelete(/*row*/ ctx[25]['id'], /*row*/ ctx[25]['name']))) handlePatientDelete(/*row*/ ctx[25]['id'], /*row*/ ctx[25]['name']).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			create_component(overflowmenuitem0.$$.fragment);
    			t = space();
    			create_component(overflowmenuitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(overflowmenuitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(overflowmenuitem1, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overflowmenuitem0.$$.fragment, local);
    			transition_in(overflowmenuitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overflowmenuitem0.$$.fragment, local);
    			transition_out(overflowmenuitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(overflowmenuitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(overflowmenuitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(167:10) <OverflowMenu flipped>",
    		ctx
    	});

    	return block;
    }

    // (165:6) <svelte:fragment slot="cell" let:cell let:row>
    function create_cell_slot(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*cell*/ ctx[24].key === "overflow") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_cell_slot.name,
    		type: "slot",
    		source: "(165:6) <svelte:fragment slot=\\\"cell\\\" let:cell let:row>",
    		ctx
    	});

    	return block;
    }

    // (212:0) <DatePicker dateFormat="d/m/Y" datePickerType="single" on:change bind:value={dob}>
    function create_default_slot_1(ctx) {
    	let datepickerinput;
    	let current;

    	datepickerinput = new DatePickerInput$1({
    			props: {
    				labelText: "Date of birth",
    				placeholder: "dd/mm/yyyy"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(datepickerinput.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(datepickerinput, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(datepickerinput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(datepickerinput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(datepickerinput, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(212:0) <DatePicker dateFormat=\\\"d/m/Y\\\" datePickerType=\\\"single\\\" on:change bind:value={dob}>",
    		ctx
    	});

    	return block;
    }

    // (216:0) {#if successfulPatientCreation}
    function create_if_block_1(ctx) {
    	let inlinenotification;
    	let current;

    	inlinenotification = new InlineNotification$1({
    			props: {
    				lowContrast: true,
    				kind: "success",
    				title: "Success:",
    				subtitle: "Patient creation successful. It might take some time for the changes to propagate. You may close this page"
    			},
    			$$inline: true
    		});

    	inlinenotification.$on("close", /*close_handler*/ ctx[17]);

    	const block = {
    		c: function create() {
    			create_component(inlinenotification.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(inlinenotification, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inlinenotification.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inlinenotification.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(inlinenotification, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(216:0) {#if successfulPatientCreation}",
    		ctx
    	});

    	return block;
    }

    // (227:0) {#if badData}
    function create_if_block(ctx) {
    	let inlinenotification;
    	let current;

    	inlinenotification = new InlineNotification$1({
    			props: {
    				lowContrast: true,
    				kind: "error",
    				title: "Error:",
    				subtitle: "Invalid inputs or patient already exists"
    			},
    			$$inline: true
    		});

    	inlinenotification.$on("close", /*close_handler_1*/ ctx[18]);

    	const block = {
    		c: function create() {
    			create_component(inlinenotification.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(inlinenotification, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inlinenotification.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inlinenotification.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(inlinenotification, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(227:0) {#if badData}",
    		ctx
    	});

    	return block;
    }

    // (192:0) <Modal   preventCloseOnClickOutside   size="lg"   bind:open   modalHeading="Create patient resource"   primaryButtonText="Confirm"   secondaryButtonText="Close"   primaryButtonDisabled={isPrimaryButtonClicked}   on:click:button--secondary={() => (open = false, successfulPatientCreation = false)}   on:open   on:close={handleClose}   on:submit={handlePatientCreate} >
    function create_default_slot(ctx) {
    	let textinput;
    	let updating_value;
    	let t0;
    	let dropdown;
    	let updating_selectedId;
    	let t1;
    	let datepicker;
    	let updating_value_1;
    	let t2;
    	let t3;
    	let t4;
    	let div;
    	let current;

    	function textinput_value_binding(value) {
    		/*textinput_value_binding*/ ctx[13](value);
    	}

    	let textinput_props = {
    		labelText: "Patient name",
    		placeholder: "Enter name ..."
    	};

    	if (/*patientName*/ ctx[2] !== void 0) {
    		textinput_props.value = /*patientName*/ ctx[2];
    	}

    	textinput = new TextInput$1({ props: textinput_props, $$inline: true });
    	binding_callbacks.push(() => bind(textinput, 'value', textinput_value_binding));

    	function dropdown_selectedId_binding(value) {
    		/*dropdown_selectedId_binding*/ ctx[14](value);
    	}

    	let dropdown_props = {
    		titleText: "Gender",
    		items: /*gender_lut*/ ctx[10]
    	};

    	if (/*gender*/ ctx[3] !== void 0) {
    		dropdown_props.selectedId = /*gender*/ ctx[3];
    	}

    	dropdown = new Dropdown$1({ props: dropdown_props, $$inline: true });
    	binding_callbacks.push(() => bind(dropdown, 'selectedId', dropdown_selectedId_binding));

    	function datepicker_value_binding(value) {
    		/*datepicker_value_binding*/ ctx[15](value);
    	}

    	let datepicker_props = {
    		dateFormat: "d/m/Y",
    		datePickerType: "single",
    		$$slots: { default: [create_default_slot_1] },
    		$$scope: { ctx }
    	};

    	if (/*dob*/ ctx[4] !== void 0) {
    		datepicker_props.value = /*dob*/ ctx[4];
    	}

    	datepicker = new DatePicker$1({ props: datepicker_props, $$inline: true });
    	binding_callbacks.push(() => bind(datepicker, 'value', datepicker_value_binding));
    	datepicker.$on("change", /*change_handler*/ ctx[16]);
    	let if_block0 = /*successfulPatientCreation*/ ctx[1] && create_if_block_1(ctx);
    	let if_block1 = /*badData*/ ctx[5] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			create_component(textinput.$$.fragment);
    			t0 = space();
    			create_component(dropdown.$$.fragment);
    			t1 = space();
    			create_component(datepicker.$$.fragment);
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if (if_block1) if_block1.c();
    			t4 = space();
    			div = element("div");
    			attr_dev(div, "class", "spacer svelte-1ddlxvh");
    			add_location(div, file, 235, 4, 6388);
    		},
    		m: function mount(target, anchor) {
    			mount_component(textinput, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdown, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(datepicker, target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textinput_changes = {};

    			if (!updating_value && dirty & /*patientName*/ 4) {
    				updating_value = true;
    				textinput_changes.value = /*patientName*/ ctx[2];
    				add_flush_callback(() => updating_value = false);
    			}

    			textinput.$set(textinput_changes);
    			const dropdown_changes = {};

    			if (!updating_selectedId && dirty & /*gender*/ 8) {
    				updating_selectedId = true;
    				dropdown_changes.selectedId = /*gender*/ ctx[3];
    				add_flush_callback(() => updating_selectedId = false);
    			}

    			dropdown.$set(dropdown_changes);
    			const datepicker_changes = {};

    			if (dirty & /*$$scope*/ 67108864) {
    				datepicker_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_1 && dirty & /*dob*/ 16) {
    				updating_value_1 = true;
    				datepicker_changes.value = /*dob*/ ctx[4];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			datepicker.$set(datepicker_changes);

    			if (/*successfulPatientCreation*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*successfulPatientCreation*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t3.parentNode, t3);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*badData*/ ctx[5]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*badData*/ 32) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t4.parentNode, t4);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textinput.$$.fragment, local);
    			transition_in(dropdown.$$.fragment, local);
    			transition_in(datepicker.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textinput.$$.fragment, local);
    			transition_out(dropdown.$$.fragment, local);
    			transition_out(datepicker.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(textinput, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(dropdown, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(datepicker, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(192:0) <Modal   preventCloseOnClickOutside   size=\\\"lg\\\"   bind:open   modalHeading=\\\"Create patient resource\\\"   primaryButtonText=\\\"Confirm\\\"   secondaryButtonText=\\\"Close\\\"   primaryButtonDisabled={isPrimaryButtonClicked}   on:click:button--secondary={() => (open = false, successfulPatientCreation = false)}   on:open   on:close={handleClose}   on:submit={handlePatientCreate} >",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let datatable;
    	let t;
    	let modal;
    	let updating_open;
    	let current;

    	datatable = new DataTable$1({
    			props: {
    				title: "Patient management",
    				sortable: true,
    				zebra: true,
    				stickHeader: true,
    				description: "" + (/*patient_count*/ ctx[7] + " patient(s) found"),
    				headers: /*headers*/ ctx[8],
    				rows: /*rows*/ ctx[9],
    				$$slots: {
    					cell: [
    						create_cell_slot,
    						({ cell, row }) => ({ 24: cell, 25: row }),
    						({ cell, row }) => (cell ? 16777216 : 0) | (row ? 33554432 : 0)
    					],
    					default: [create_default_slot_3]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function modal_open_binding(value) {
    		/*modal_open_binding*/ ctx[19](value);
    	}

    	let modal_props = {
    		preventCloseOnClickOutside: true,
    		size: "lg",
    		modalHeading: "Create patient resource",
    		primaryButtonText: "Confirm",
    		secondaryButtonText: "Close",
    		primaryButtonDisabled: /*isPrimaryButtonClicked*/ ctx[6],
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	if (/*open*/ ctx[0] !== void 0) {
    		modal_props.open = /*open*/ ctx[0];
    	}

    	modal = new Modal$1({ props: modal_props, $$inline: true });
    	binding_callbacks.push(() => bind(modal, 'open', modal_open_binding));
    	modal.$on("click:button--secondary", /*click_button_secondary_handler*/ ctx[20]);
    	modal.$on("open", /*open_handler*/ ctx[21]);
    	modal.$on("close", handleClose);
    	modal.$on("submit", /*handlePatientCreate*/ ctx[11]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(datatable.$$.fragment);
    			t = space();
    			create_component(modal.$$.fragment);
    			attr_dev(main, "class", "svelte-1ddlxvh");
    			add_location(main, file, 155, 0, 4007);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(datatable, main, null);
    			append_dev(main, t);
    			mount_component(modal, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const datatable_changes = {};

    			if (dirty & /*$$scope, row, cell, open*/ 117440513) {
    				datatable_changes.$$scope = { dirty, ctx };
    			}

    			datatable.$set(datatable_changes);
    			const modal_changes = {};
    			if (dirty & /*isPrimaryButtonClicked*/ 64) modal_changes.primaryButtonDisabled = /*isPrimaryButtonClicked*/ ctx[6];

    			if (dirty & /*$$scope, successfulPatientCreation, badData, dob, gender, patientName*/ 67108926) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_open && dirty & /*open*/ 1) {
    				updating_open = true;
    				modal_changes.open = /*open*/ ctx[0];
    				add_flush_callback(() => updating_open = false);
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(datatable.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(datatable.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(datatable);
    			destroy_component(modal);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function handleClose(event) {
    	window.location.reload();
    }

    async function viewResource(patientID) {
    	const operation = new FormData();
    	operation.append('operation', 'VIEW');
    	operation.append('id', patientID);
    	const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

    	const response = await fetch(window.location.href, {
    		method: 'POST',
    		body: operation,
    		headers: { 'X-CSRFToken': csrfToken }
    	});

    	if (response.ok) {
    		alert('Yet to be implemented');
    	}
    } // console.log(response.headers.get('RetVal'))

    async function handlePatientDelete(patientID, patientName) {
    	const deleteData = new FormData();
    	deleteData.append('operation', 'DELETE');
    	deleteData.append('id', patientID);
    	deleteData.append('name', patientName);
    	const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

    	try {
    		const response = await fetch(window.location.href, {
    			method: 'POST',
    			body: deleteData,
    			headers: { 'X-CSRFToken': csrfToken }
    		});

    		if (response.ok) {
    			alert('Patient deleted');
    			window.location.reload();
    		} else {
    			alert('Patient deletion failed');
    			window.location.reload();
    		}
    	} catch(error) {
    		alert('An error occured');
    		window.location.reload();
    	}
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PatientManagement', slots, []);
    	let patients = String(window.fhir_patients);
    	let patient_count = Number(window.fhir_patient_count);
    	let headers = [];
    	let rows = [];

    	if (patients === '[]') {
    		headers.push({ key: 'id', value: 'id' });
    		headers.push({ key: 'name', value: 'e.g. name' });
    		headers.push({ key: 'gender', value: 'e.g. gender' });

    		headers.push({
    			key: 'birthDate',
    			value: 'e.g. birthDate'
    		});
    	} else {
    		patients = JSON.parse(patients);
    		const cols = Object.keys(patients[0].resource).slice(1);

    		cols.forEach(element => headers.push({
    			key: element.toLowerCase(),
    			value: element
    		}));

    		patients.forEach(element => rows.push({
    			id: element.resource.id,
    			name: element.resource.name[0].text,
    			gender: element.resource.gender,
    			birthdate: element.resource.birthDate
    		}));
    	}

    	headers.push({ key: "overflow", empty: true });
    	let open = false;
    	let successfulPatientCreation = false;
    	let patientName = '';
    	let gender = "0";
    	let dob = '';
    	let badData = false;
    	let isPrimaryButtonClicked = false;
    	let deletePatient = false;

    	let gender_lut = [
    		{ id: "0", text: "Male" },
    		{ id: "1", text: "Female" },
    		{ id: "2", text: "Other" }
    	];

    	async function handlePatientCreate(event) {
    		$$invalidate(6, isPrimaryButtonClicked = true);
    		$$invalidate(5, badData = false);
    		event.preventDefault();
    		const formData = new FormData();

    		if (patientName === '' || dob === '') {
    			$$invalidate(5, badData = true);
    			return;
    		}

    		if (patientName.includes('_')) {
    			$$invalidate(5, badData = true);
    			return;
    		}

    		formData.append('operation', 'CREATE');
    		formData.append('name', patientName);
    		formData.append('gender', gender_lut[gender].text);
    		formData.append('dob', dob);
    		const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

    		try {
    			const response = await fetch(window.location.href, {
    				method: 'POST',
    				body: formData,
    				headers: { 'X-CSRFToken': csrfToken }
    			});

    			if (response.ok) {
    				$$invalidate(1, successfulPatientCreation = true);
    			} else {
    				$$invalidate(5, badData = true); //		alert('Patient created');
    			}
    		} catch(error) {
    			$$invalidate(5, badData = true);
    		}
    	} //      open = false;

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PatientManagement> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, open = true);

    	function textinput_value_binding(value) {
    		patientName = value;
    		$$invalidate(2, patientName);
    	}

    	function dropdown_selectedId_binding(value) {
    		gender = value;
    		$$invalidate(3, gender);
    	}

    	function datepicker_value_binding(value) {
    		dob = value;
    		$$invalidate(4, dob);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const close_handler = () => ($$invalidate(1, successfulPatientCreation = false), $$invalidate(5, badData = false));
    	const close_handler_1 = () => ($$invalidate(1, successfulPatientCreation = false), $$invalidate(5, badData = false));

    	function modal_open_binding(value) {
    		open = value;
    		$$invalidate(0, open);
    	}

    	const click_button_secondary_handler = () => ($$invalidate(0, open = false), $$invalidate(1, successfulPatientCreation = false));

    	function open_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$capture_state = () => ({
    		DataTable: DataTable$1,
    		Dropdown: Dropdown$1,
    		DatePicker: DatePicker$1,
    		DatePickerInput: DatePickerInput$1,
    		InlineNotification: InlineNotification$1,
    		Modal: Modal$1,
    		OverflowMenu: OverflowMenu$1,
    		OverflowMenuItem: OverflowMenuItem$1,
    		TextInput: TextInput$1,
    		Toolbar: Toolbar$1,
    		ToolbarContent: ToolbarContent$1,
    		ToolbarSearch: ToolbarSearch$1,
    		ToolbarMenu: ToolbarMenu$1,
    		ToolbarMenuItem: ToolbarMenuItem$1,
    		Button: Button$1,
    		patients,
    		patient_count,
    		headers,
    		rows,
    		open,
    		successfulPatientCreation,
    		patientName,
    		gender,
    		dob,
    		badData,
    		isPrimaryButtonClicked,
    		deletePatient,
    		gender_lut,
    		handleClose,
    		handlePatientCreate,
    		viewResource,
    		handlePatientDelete
    	});

    	$$self.$inject_state = $$props => {
    		if ('patients' in $$props) patients = $$props.patients;
    		if ('patient_count' in $$props) $$invalidate(7, patient_count = $$props.patient_count);
    		if ('headers' in $$props) $$invalidate(8, headers = $$props.headers);
    		if ('rows' in $$props) $$invalidate(9, rows = $$props.rows);
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('successfulPatientCreation' in $$props) $$invalidate(1, successfulPatientCreation = $$props.successfulPatientCreation);
    		if ('patientName' in $$props) $$invalidate(2, patientName = $$props.patientName);
    		if ('gender' in $$props) $$invalidate(3, gender = $$props.gender);
    		if ('dob' in $$props) $$invalidate(4, dob = $$props.dob);
    		if ('badData' in $$props) $$invalidate(5, badData = $$props.badData);
    		if ('isPrimaryButtonClicked' in $$props) $$invalidate(6, isPrimaryButtonClicked = $$props.isPrimaryButtonClicked);
    		if ('deletePatient' in $$props) deletePatient = $$props.deletePatient;
    		if ('gender_lut' in $$props) $$invalidate(10, gender_lut = $$props.gender_lut);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		open,
    		successfulPatientCreation,
    		patientName,
    		gender,
    		dob,
    		badData,
    		isPrimaryButtonClicked,
    		patient_count,
    		headers,
    		rows,
    		gender_lut,
    		handlePatientCreate,
    		click_handler,
    		textinput_value_binding,
    		dropdown_selectedId_binding,
    		datepicker_value_binding,
    		change_handler,
    		close_handler,
    		close_handler_1,
    		modal_open_binding,
    		click_button_secondary_handler,
    		open_handler
    	];
    }

    class PatientManagement extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PatientManagement",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const pmgmt = new PatientManagement({
    	target: document.body,
    	props: {
    //	 name: 'world'
    	}
    });

    function rangePlugin(config = {}) {
        return function (fp) {
            let dateFormat = "", secondInput, _secondInputFocused, _prevDates;
            const createSecondInput = () => {
                if (config.input) {
                    secondInput =
                        config.input instanceof Element
                            ? config.input
                            : window.document.querySelector(config.input);
                    if (!secondInput) {
                        fp.config.errorHandler(new Error("Invalid input element specified"));
                        return;
                    }
                    if (fp.config.wrap) {
                        secondInput = secondInput.querySelector("[data-input]");
                    }
                }
                else {
                    secondInput = fp._input.cloneNode();
                    secondInput.removeAttribute("id");
                    secondInput._flatpickr = undefined;
                }
                if (secondInput.value) {
                    const parsedDate = fp.parseDate(secondInput.value);
                    if (parsedDate)
                        fp.selectedDates.push(parsedDate);
                }
                secondInput.setAttribute("data-fp-omit", "");
                if (fp.config.clickOpens) {
                    fp._bind(secondInput, ["focus", "click"], () => {
                        if (fp.selectedDates[1]) {
                            fp.latestSelectedDateObj = fp.selectedDates[1];
                            fp._setHoursFromDate(fp.selectedDates[1]);
                            fp.jumpToDate(fp.selectedDates[1]);
                        }
                        _secondInputFocused = true;
                        fp.isOpen = false;
                        fp.open(undefined, config.position === "left" ? fp._input : secondInput);
                    });
                    fp._bind(fp._input, ["focus", "click"], (e) => {
                        e.preventDefault();
                        fp.isOpen = false;
                        fp.open();
                    });
                }
                if (fp.config.allowInput)
                    fp._bind(secondInput, "keydown", (e) => {
                        if (e.key === "Enter") {
                            fp.setDate([fp.selectedDates[0], secondInput.value], true, dateFormat);
                            secondInput.click();
                        }
                    });
                if (!config.input)
                    fp._input.parentNode &&
                        fp._input.parentNode.insertBefore(secondInput, fp._input.nextSibling);
            };
            const plugin = {
                onParseConfig() {
                    fp.config.mode = "range";
                    dateFormat = fp.config.altInput
                        ? fp.config.altFormat
                        : fp.config.dateFormat;
                },
                onReady() {
                    createSecondInput();
                    fp.config.ignoredFocusElements.push(secondInput);
                    if (fp.config.allowInput) {
                        fp._input.removeAttribute("readonly");
                        secondInput.removeAttribute("readonly");
                    }
                    else {
                        secondInput.setAttribute("readonly", "readonly");
                    }
                    fp._bind(fp._input, "focus", () => {
                        fp.latestSelectedDateObj = fp.selectedDates[0];
                        fp._setHoursFromDate(fp.selectedDates[0]);
                        _secondInputFocused = false;
                        fp.jumpToDate(fp.selectedDates[0]);
                    });
                    if (fp.config.allowInput)
                        fp._bind(fp._input, "keydown", (e) => {
                            if (e.key === "Enter")
                                fp.setDate([fp._input.value, fp.selectedDates[1]], true, dateFormat);
                        });
                    fp.setDate(fp.selectedDates, false);
                    plugin.onValueUpdate(fp.selectedDates);
                    fp.loadedPlugins.push("range");
                },
                onPreCalendarPosition() {
                    if (_secondInputFocused) {
                        fp._positionElement = secondInput;
                        setTimeout(() => {
                            fp._positionElement = fp._input;
                        }, 0);
                    }
                },
                onChange() {
                    if (!fp.selectedDates.length) {
                        setTimeout(() => {
                            if (fp.selectedDates.length)
                                return;
                            secondInput.value = "";
                            _prevDates = [];
                        }, 10);
                    }
                    if (_secondInputFocused) {
                        setTimeout(() => {
                            secondInput.focus();
                        }, 0);
                    }
                },
                onDestroy() {
                    if (!config.input)
                        secondInput.parentNode &&
                            secondInput.parentNode.removeChild(secondInput);
                },
                onValueUpdate(selDates) {
                    if (!secondInput)
                        return;
                    _prevDates =
                        !_prevDates || selDates.length >= _prevDates.length
                            ? [...selDates]
                            : _prevDates;
                    if (_prevDates.length > selDates.length) {
                        const newSelectedDate = selDates[0];
                        const newDates = _secondInputFocused
                            ? [_prevDates[0], newSelectedDate]
                            : [newSelectedDate, _prevDates[1]];
                        fp.setDate(newDates, false);
                        _prevDates = [...newDates];
                    }
                    [
                        fp._input.value = "",
                        secondInput.value = "",
                    ] = fp.selectedDates.map((d) => fp.formatDate(d, dateFormat));
                },
            };
            return plugin;
        };
    }

    var rangePlugin$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': rangePlugin
    });

    return pmgmt;

})();
//# sourceMappingURL=pmgmt.js.map
