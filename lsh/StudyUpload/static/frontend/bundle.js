
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
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
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
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
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
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

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    var COMMON_MIME_TYPES = new Map([
        ['avi', 'video/avi'],
        ['gif', 'image/gif'],
        ['ico', 'image/x-icon'],
        ['jpeg', 'image/jpeg'],
        ['jpg', 'image/jpeg'],
        ['mkv', 'video/x-matroska'],
        ['mov', 'video/quicktime'],
        ['mp4', 'video/mp4'],
        ['pdf', 'application/pdf'],
        ['png', 'image/png'],
        ['zip', 'application/zip'],
        ['doc', 'application/msword'],
        ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    ]);
    function toFileWithPath(file, path) {
        var f = withMimeType(file);
        if (typeof f.path !== 'string') { // on electron, path is already set to the absolute path
            var webkitRelativePath = file.webkitRelativePath;
            Object.defineProperty(f, 'path', {
                value: typeof path === 'string'
                    ? path
                    // If <input webkitdirectory> is set,
                    // the File will have a {webkitRelativePath} property
                    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory
                    : typeof webkitRelativePath === 'string' && webkitRelativePath.length > 0
                        ? webkitRelativePath
                        : file.name,
                writable: false,
                configurable: false,
                enumerable: true
            });
        }
        return f;
    }
    function withMimeType(file) {
        var name = file.name;
        var hasExtension = name && name.lastIndexOf('.') !== -1;
        if (hasExtension && !file.type) {
            var ext = name.split('.')
                .pop().toLowerCase();
            var type = COMMON_MIME_TYPES.get(ext);
            if (type) {
                Object.defineProperty(file, 'type', {
                    value: type,
                    writable: false,
                    configurable: false,
                    enumerable: true
                });
            }
        }
        return file;
    }

    var FILES_TO_IGNORE = [
        // Thumbnail cache files for macOS and Windows
        '.DS_Store',
        'Thumbs.db' // Windows
    ];
    /**
     * Convert a DragEvent's DataTrasfer object to a list of File objects
     * NOTE: If some of the items are folders,
     * everything will be flattened and placed in the same list but the paths will be kept as a {path} property.
     * @param evt
     */
    function fromEvent(evt) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, isDragEvt(evt) && evt.dataTransfer
                        ? getDataTransferFiles(evt.dataTransfer, evt.type)
                        : getInputFiles(evt)];
            });
        });
    }
    function isDragEvt(value) {
        return !!value.dataTransfer;
    }
    function getInputFiles(evt) {
        var files = isInput(evt.target)
            ? evt.target.files
                ? fromList(evt.target.files)
                : []
            : [];
        return files.map(function (file) { return toFileWithPath(file); });
    }
    function isInput(value) {
        return value !== null;
    }
    function getDataTransferFiles(dt, type) {
        return __awaiter(this, void 0, void 0, function () {
            var items, files;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!dt.items) return [3 /*break*/, 2];
                        items = fromList(dt.items)
                            .filter(function (item) { return item.kind === 'file'; });
                        // According to https://html.spec.whatwg.org/multipage/dnd.html#dndevents,
                        // only 'dragstart' and 'drop' has access to the data (source node)
                        if (type !== 'drop') {
                            return [2 /*return*/, items];
                        }
                        return [4 /*yield*/, Promise.all(items.map(toFilePromises))];
                    case 1:
                        files = _a.sent();
                        return [2 /*return*/, noIgnoredFiles(flatten(files))];
                    case 2: return [2 /*return*/, noIgnoredFiles(fromList(dt.files)
                            .map(function (file) { return toFileWithPath(file); }))];
                }
            });
        });
    }
    function noIgnoredFiles(files) {
        return files.filter(function (file) { return FILES_TO_IGNORE.indexOf(file.name) === -1; });
    }
    // IE11 does not support Array.from()
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Browser_compatibility
    // https://developer.mozilla.org/en-US/docs/Web/API/FileList
    // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItemList
    function fromList(items) {
        var files = [];
        // tslint:disable: prefer-for-of
        for (var i = 0; i < items.length; i++) {
            var file = items[i];
            files.push(file);
        }
        return files;
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem
    function toFilePromises(item) {
        if (typeof item.webkitGetAsEntry !== 'function') {
            return fromDataTransferItem(item);
        }
        var entry = item.webkitGetAsEntry();
        // Safari supports dropping an image node from a different window and can be retrieved using
        // the DataTransferItem.getAsFile() API
        // NOTE: FileSystemEntry.file() throws if trying to get the file
        if (entry && entry.isDirectory) {
            return fromDirEntry(entry);
        }
        return fromDataTransferItem(item);
    }
    function flatten(items) {
        return items.reduce(function (acc, files) { return __spread(acc, (Array.isArray(files) ? flatten(files) : [files])); }, []);
    }
    function fromDataTransferItem(item) {
        var file = item.getAsFile();
        if (!file) {
            return Promise.reject(item + " is not a File");
        }
        var fwp = toFileWithPath(file);
        return Promise.resolve(fwp);
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemEntry
    function fromEntry(entry) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, entry.isDirectory ? fromDirEntry(entry) : fromFileEntry(entry)];
            });
        });
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryEntry
    function fromDirEntry(entry) {
        var reader = entry.createReader();
        return new Promise(function (resolve, reject) {
            var entries = [];
            function readEntries() {
                var _this = this;
                // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryEntry/createReader
                // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryReader/readEntries
                reader.readEntries(function (batch) { return __awaiter(_this, void 0, void 0, function () {
                    var files, err_1, items;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!!batch.length) return [3 /*break*/, 5];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, Promise.all(entries)];
                            case 2:
                                files = _a.sent();
                                resolve(files);
                                return [3 /*break*/, 4];
                            case 3:
                                err_1 = _a.sent();
                                reject(err_1);
                                return [3 /*break*/, 4];
                            case 4: return [3 /*break*/, 6];
                            case 5:
                                items = Promise.all(batch.map(fromEntry));
                                entries.push(items);
                                // Continue reading
                                readEntries();
                                _a.label = 6;
                            case 6: return [2 /*return*/];
                        }
                    });
                }); }, function (err) {
                    reject(err);
                });
            }
            readEntries();
        });
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileEntry
    function fromFileEntry(entry) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        entry.file(function (file) {
                            var fwp = toFileWithPath(file, entry.fullPath);
                            resolve(fwp);
                        }, function (err) {
                            reject(err);
                        });
                    })];
            });
        });
    }

    /**
     * Check if the provided file type should be accepted by the input with accept attribute.
     * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#attr-accept
     *
     * Inspired by https://github.com/enyo/dropzone
     *
     * @param file {File} https://developer.mozilla.org/en-US/docs/Web/API/File
     * @param acceptedFiles {string}
     * @returns {boolean}
     */

    function accepts(file, acceptedFiles) {
      if (file && acceptedFiles) {
        const acceptedFilesArray = Array.isArray(acceptedFiles)
          ? acceptedFiles
          : acceptedFiles.split(",");
        const fileName = file.name || "";
        const mimeType = (file.type || "").toLowerCase();
        const baseMimeType = mimeType.replace(/\/.*$/, "");

        return acceptedFilesArray.some((type) => {
          const validType = type.trim().toLowerCase();
          if (validType.charAt(0) === ".") {
            return fileName.toLowerCase().endsWith(validType);
          } else if (validType.endsWith("/*")) {
            // This is something like a image/* mime type
            return baseMimeType === validType.replace(/\/.*$/, "");
          }
          return mimeType === validType;
        });
      }
      return true;
    }

    // Error codes
    const FILE_INVALID_TYPE = "file-invalid-type";
    const FILE_TOO_LARGE = "file-too-large";
    const FILE_TOO_SMALL = "file-too-small";
    const TOO_MANY_FILES = "too-many-files";

    // File Errors
    const getInvalidTypeRejectionErr = (accept) => {
      accept = Array.isArray(accept) && accept.length === 1 ? accept[0] : accept;
      const messageSuffix = Array.isArray(accept)
        ? `one of ${accept.join(", ")}`
        : accept;
      return {
        code: FILE_INVALID_TYPE,
        message: `File type must be ${messageSuffix}`,
      };
    };

    const getTooLargeRejectionErr = (maxSize) => {
      return {
        code: FILE_TOO_LARGE,
        message: `File is larger than ${maxSize} bytes`,
      };
    };

    const getTooSmallRejectionErr = (minSize) => {
      return {
        code: FILE_TOO_SMALL,
        message: `File is smaller than ${minSize} bytes`,
      };
    };

    const TOO_MANY_FILES_REJECTION = {
      code: TOO_MANY_FILES,
      message: "Too many files",
    };

    // Firefox versions prior to 53 return a bogus MIME type for every file drag, so dragovers with
    // that MIME type will always be accepted
    function fileAccepted(file, accept) {
      const isAcceptable =
        file.type === "application/x-moz-file" || accepts(file, accept);
      return [
        isAcceptable,
        isAcceptable ? null : getInvalidTypeRejectionErr(accept),
      ];
    }

    function fileMatchSize(file, minSize, maxSize) {
      if (isDefined(file.size)) {
        if (isDefined(minSize) && isDefined(maxSize)) {
          if (file.size > maxSize) return [false, getTooLargeRejectionErr(maxSize)];
          if (file.size < minSize) return [false, getTooSmallRejectionErr(minSize)];
        } else if (isDefined(minSize) && file.size < minSize)
          return [false, getTooSmallRejectionErr(minSize)];
        else if (isDefined(maxSize) && file.size > maxSize)
          return [false, getTooLargeRejectionErr(maxSize)];
      }
      return [true, null];
    }

    function isDefined(value) {
      return value !== undefined && value !== null;
    }

    function allFilesAccepted({
      files,
      accept,
      minSize,
      maxSize,
      multiple,
    }) {
      if (!multiple && files.length > 1) {
        return false;
      }

      return files.every((file) => {
        const [accepted] = fileAccepted(file, accept);
        const [sizeMatch] = fileMatchSize(file, minSize, maxSize);
        return accepted && sizeMatch;
      });
    }

    // React's synthetic events has event.isPropagationStopped,
    // but to remain compatibility with other libs (Preact) fall back
    // to check event.cancelBubble
    function isPropagationStopped(event) {
      if (typeof event.isPropagationStopped === "function") {
        return event.isPropagationStopped();
      } else if (typeof event.cancelBubble !== "undefined") {
        return event.cancelBubble;
      }
      return false;
    }

    function isEvtWithFiles(event) {
      if (!event.dataTransfer) {
        return !!event.target && !!event.target.files;
      }
      // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/types
      // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types#file
      return Array.prototype.some.call(
        event.dataTransfer.types,
        (type) => type === "Files" || type === "application/x-moz-file"
      );
    }

    function isIe(userAgent) {
      return (
        userAgent.indexOf("MSIE") !== -1 || userAgent.indexOf("Trident/") !== -1
      );
    }

    function isEdge(userAgent) {
      return userAgent.indexOf("Edge/") !== -1;
    }

    function isIeOrEdge(userAgent = window.navigator.userAgent) {
      return isIe(userAgent) || isEdge(userAgent);
    }

    /**
     * This is intended to be used to compose event handlers
     * They are executed in order until one of them calls `event.isPropagationStopped()`.
     * Note that the check is done on the first invoke too,
     * meaning that if propagation was stopped before invoking the fns,
     * no handlers will be executed.
     *
     * @param {Function} fns the event hanlder functions
     * @return {Function} the event handler to add to an element
     */
    function composeEventHandlers(...fns) {
      return (event, ...args) =>
        fns.some((fn) => {
          if (!isPropagationStopped(event) && fn) {
            fn(event, ...args);
          }
          return isPropagationStopped(event);
        });
    }

    /* node_modules/svelte-file-dropzone/src/components/Dropzone.svelte generated by Svelte v3.55.1 */
    const file$q = "node_modules/svelte-file-dropzone/src/components/Dropzone.svelte";

    // (354:8)
    function fallback_block$6(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Drag 'n' drop some files here, or click to select files";
    			add_location(p, file$q, 354, 4, 9212);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$6.name,
    		type: "fallback",
    		source: "(354:8)       ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let div;
    	let input;
    	let t;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[32].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[31], null);
    	const default_slot_or_fallback = default_slot || fallback_block$6(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t = space();
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(input, "accept", /*accept*/ ctx[0]);
    			input.multiple = /*multiple*/ ctx[1];
    			attr_dev(input, "type", "file");
    			attr_dev(input, "name", /*name*/ ctx[5]);
    			attr_dev(input, "autocomplete", "off");
    			attr_dev(input, "tabindex", "-1");
    			set_style(input, "display", "none");
    			add_location(input, file$q, 342, 2, 8964);
    			attr_dev(div, "tabindex", "0");
    			attr_dev(div, "class", div_class_value = "" + ((/*disableDefaultStyles*/ ctx[4] ? '' : 'dropzone') + " " + /*containerClasses*/ ctx[2] + " svelte-817dg2"));
    			attr_dev(div, "style", /*containerStyles*/ ctx[3]);
    			add_location(div, file$q, 328, 0, 8433);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			/*input_binding*/ ctx[33](input);
    			append_dev(div, t);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(div, null);
    			}

    			/*div_binding*/ ctx[34](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "focus", /*onWindowFocus*/ ctx[21], false, false, false),
    					listen_dev(window, "dragover", /*onDocumentDragOver*/ ctx[19], false, false, false),
    					listen_dev(window, "drop", /*onDocumentDrop*/ ctx[20], false, false, false),
    					listen_dev(input, "change", /*onDropCb*/ ctx[15], false, false, false),
    					listen_dev(input, "click", onInputElementClick, false, false, false),
    					listen_dev(div, "keydown", /*composeKeyboardHandler*/ ctx[17](/*onKeyDownCb*/ ctx[8]), false, false, false),
    					listen_dev(div, "focus", /*composeKeyboardHandler*/ ctx[17](/*onFocusCb*/ ctx[9]), false, false, false),
    					listen_dev(div, "blur", /*composeKeyboardHandler*/ ctx[17](/*onBlurCb*/ ctx[10]), false, false, false),
    					listen_dev(div, "click", /*composeHandler*/ ctx[16](/*onClickCb*/ ctx[11]), false, false, false),
    					listen_dev(div, "dragenter", /*composeDragHandler*/ ctx[18](/*onDragEnterCb*/ ctx[12]), false, false, false),
    					listen_dev(div, "dragover", /*composeDragHandler*/ ctx[18](/*onDragOverCb*/ ctx[13]), false, false, false),
    					listen_dev(div, "dragleave", /*composeDragHandler*/ ctx[18](/*onDragLeaveCb*/ ctx[14]), false, false, false),
    					listen_dev(div, "drop", /*composeDragHandler*/ ctx[18](/*onDropCb*/ ctx[15]), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*accept*/ 1) {
    				attr_dev(input, "accept", /*accept*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*multiple*/ 2) {
    				prop_dev(input, "multiple", /*multiple*/ ctx[1]);
    			}

    			if (!current || dirty[0] & /*name*/ 32) {
    				attr_dev(input, "name", /*name*/ ctx[5]);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[31],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[31])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[31], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty[0] & /*disableDefaultStyles, containerClasses*/ 20 && div_class_value !== (div_class_value = "" + ((/*disableDefaultStyles*/ ctx[4] ? '' : 'dropzone') + " " + /*containerClasses*/ ctx[2] + " svelte-817dg2"))) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty[0] & /*containerStyles*/ 8) {
    				attr_dev(div, "style", /*containerStyles*/ ctx[3]);
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
    			if (detaching) detach_dev(div);
    			/*input_binding*/ ctx[33](null);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*div_binding*/ ctx[34](null);
    			mounted = false;
    			run_all(dispose);
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

    function onInputElementClick(event) {
    	event.stopPropagation();
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dropzone', slots, ['default']);
    	let { accept } = $$props;
    	let { disabled = false } = $$props;
    	let { getFilesFromEvent = fromEvent } = $$props;
    	let { maxSize = Infinity } = $$props;
    	let { minSize = 0 } = $$props;
    	let { multiple = true } = $$props;
    	let { preventDropOnDocument = true } = $$props;
    	let { noClick = false } = $$props;
    	let { noKeyboard = false } = $$props;
    	let { noDrag = false } = $$props;
    	let { noDragEventsBubbling = false } = $$props;
    	let { containerClasses = "" } = $$props;
    	let { containerStyles = "" } = $$props;
    	let { disableDefaultStyles = false } = $$props;
    	let { name = "" } = $$props;
    	const dispatch = createEventDispatcher();

    	//state
    	let state = {
    		isFocused: false,
    		isFileDialogActive: false,
    		isDragActive: false,
    		isDragAccept: false,
    		isDragReject: false,
    		draggedFiles: [],
    		acceptedFiles: [],
    		fileRejections: []
    	};

    	let rootRef;
    	let inputRef;

    	function resetState() {
    		state.isFileDialogActive = false;
    		state.isDragActive = false;
    		state.draggedFiles = [];
    		state.acceptedFiles = [];
    		state.fileRejections = [];
    	}

    	// Fn for opening the file dialog programmatically
    	function openFileDialog() {
    		if (inputRef) {
    			$$invalidate(7, inputRef.value = null, inputRef); // TODO check if null needs to be set
    			state.isFileDialogActive = true;
    			inputRef.click();
    		}
    	}

    	// Cb to open the file dialog when SPACE/ENTER occurs on the dropzone
    	function onKeyDownCb(event) {
    		// Ignore keyboard events bubbling up the DOM tree
    		if (!rootRef || !rootRef.isEqualNode(event.target)) {
    			return;
    		}

    		if (event.keyCode === 32 || event.keyCode === 13) {
    			event.preventDefault();
    			openFileDialog();
    		}
    	}

    	// Update focus state for the dropzone
    	function onFocusCb() {
    		state.isFocused = true;
    	}

    	function onBlurCb() {
    		state.isFocused = false;
    	}

    	// Cb to open the file dialog when click occurs on the dropzone
    	function onClickCb() {
    		if (noClick) {
    			return;
    		}

    		// In IE11/Edge the file-browser dialog is blocking, therefore, use setTimeout()
    		// to ensure React can handle state changes
    		// See: https://github.com/react-dropzone/react-dropzone/issues/450
    		if (isIeOrEdge()) {
    			setTimeout(openFileDialog, 0);
    		} else {
    			openFileDialog();
    		}
    	}

    	function onDragEnterCb(event) {
    		event.preventDefault();
    		stopPropagation(event);
    		dragTargetsRef = [...dragTargetsRef, event.target];

    		if (isEvtWithFiles(event)) {
    			Promise.resolve(getFilesFromEvent(event)).then(draggedFiles => {
    				if (isPropagationStopped(event) && !noDragEventsBubbling) {
    					return;
    				}

    				state.draggedFiles = draggedFiles;
    				state.isDragActive = true;
    				dispatch("dragenter", { dragEvent: event });
    			});
    		}
    	}

    	function onDragOverCb(event) {
    		event.preventDefault();
    		stopPropagation(event);

    		if (event.dataTransfer) {
    			try {
    				event.dataTransfer.dropEffect = "copy";
    			} catch {

    			} /* eslint-disable-line no-empty */
    		}

    		if (isEvtWithFiles(event)) {
    			dispatch("dragover", { dragEvent: event });
    		}

    		return false;
    	}

    	function onDragLeaveCb(event) {
    		event.preventDefault();
    		stopPropagation(event);

    		// Only deactivate once the dropzone and all children have been left
    		const targets = dragTargetsRef.filter(target => rootRef && rootRef.contains(target));

    		// Make sure to remove a target present multiple times only once
    		// (Firefox may fire dragenter/dragleave multiple times on the same element)
    		const targetIdx = targets.indexOf(event.target);

    		if (targetIdx !== -1) {
    			targets.splice(targetIdx, 1);
    		}

    		dragTargetsRef = targets;

    		if (targets.length > 0) {
    			return;
    		}

    		state.isDragActive = false;
    		state.draggedFiles = [];

    		if (isEvtWithFiles(event)) {
    			dispatch("dragleave", { dragEvent: event });
    		}
    	}

    	function onDropCb(event) {
    		event.preventDefault();
    		stopPropagation(event);
    		dragTargetsRef = [];

    		if (isEvtWithFiles(event)) {
    			dispatch("filedropped", { event });

    			Promise.resolve(getFilesFromEvent(event)).then(files => {
    				if (isPropagationStopped(event) && !noDragEventsBubbling) {
    					return;
    				}

    				const acceptedFiles = [];
    				const fileRejections = [];

    				files.forEach(file => {
    					const [accepted, acceptError] = fileAccepted(file, accept);
    					const [sizeMatch, sizeError] = fileMatchSize(file, minSize, maxSize);

    					if (accepted && sizeMatch) {
    						acceptedFiles.push(file);
    					} else {
    						const errors = [acceptError, sizeError].filter(e => e);
    						fileRejections.push({ file, errors });
    					}
    				});

    				if (!multiple && acceptedFiles.length > 1) {
    					// Reject everything and empty accepted files
    					acceptedFiles.forEach(file => {
    						fileRejections.push({ file, errors: [TOO_MANY_FILES_REJECTION] });
    					});

    					acceptedFiles.splice(0);
    				}

    				state.acceptedFiles = acceptedFiles;
    				state.fileRejections = fileRejections;
    				dispatch("drop", { acceptedFiles, fileRejections, event });

    				if (fileRejections.length > 0) {
    					dispatch("droprejected", { fileRejections, event });
    				}

    				if (acceptedFiles.length > 0) {
    					dispatch("dropaccepted", { acceptedFiles, event });
    				}
    			});
    		}

    		resetState();
    	}

    	function composeHandler(fn) {
    		return disabled ? null : fn;
    	}

    	function composeKeyboardHandler(fn) {
    		return noKeyboard ? null : composeHandler(fn);
    	}

    	function composeDragHandler(fn) {
    		return noDrag ? null : composeHandler(fn);
    	}

    	function stopPropagation(event) {
    		if (noDragEventsBubbling) {
    			event.stopPropagation();
    		}
    	}

    	// allow the entire document to be a drag target
    	function onDocumentDragOver(event) {
    		if (preventDropOnDocument) {
    			event.preventDefault();
    		}
    	}

    	let dragTargetsRef = [];

    	function onDocumentDrop(event) {
    		if (!preventDropOnDocument) {
    			return;
    		}

    		if (rootRef && rootRef.contains(event.target)) {
    			// If we intercepted an event for our instance, let it propagate down to the instance's onDrop handler
    			return;
    		}

    		event.preventDefault();
    		dragTargetsRef = [];
    	}

    	// Update file dialog active state when the window is focused on
    	function onWindowFocus() {
    		// Execute the timeout only if the file dialog is opened in the browser
    		if (state.isFileDialogActive) {
    			setTimeout(
    				() => {
    					if (inputRef) {
    						const { files } = inputRef;

    						if (!files.length) {
    							state.isFileDialogActive = false;
    							dispatch("filedialogcancel");
    						}
    					}
    				},
    				300
    			);
    		}
    	}

    	onDestroy(() => {
    		// This is critical for canceling the timeout behaviour on `onWindowFocus()`
    		$$invalidate(7, inputRef = null);
    	});

    	$$self.$$.on_mount.push(function () {
    		if (accept === undefined && !('accept' in $$props || $$self.$$.bound[$$self.$$.props['accept']])) {
    			console.warn("<Dropzone> was created without expected prop 'accept'");
    		}
    	});

    	const writable_props = [
    		'accept',
    		'disabled',
    		'getFilesFromEvent',
    		'maxSize',
    		'minSize',
    		'multiple',
    		'preventDropOnDocument',
    		'noClick',
    		'noKeyboard',
    		'noDrag',
    		'noDragEventsBubbling',
    		'containerClasses',
    		'containerStyles',
    		'disableDefaultStyles',
    		'name'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dropzone> was created with unknown prop '${key}'`);
    	});

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputRef = $$value;
    			$$invalidate(7, inputRef);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			rootRef = $$value;
    			$$invalidate(6, rootRef);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('accept' in $$props) $$invalidate(0, accept = $$props.accept);
    		if ('disabled' in $$props) $$invalidate(22, disabled = $$props.disabled);
    		if ('getFilesFromEvent' in $$props) $$invalidate(23, getFilesFromEvent = $$props.getFilesFromEvent);
    		if ('maxSize' in $$props) $$invalidate(24, maxSize = $$props.maxSize);
    		if ('minSize' in $$props) $$invalidate(25, minSize = $$props.minSize);
    		if ('multiple' in $$props) $$invalidate(1, multiple = $$props.multiple);
    		if ('preventDropOnDocument' in $$props) $$invalidate(26, preventDropOnDocument = $$props.preventDropOnDocument);
    		if ('noClick' in $$props) $$invalidate(27, noClick = $$props.noClick);
    		if ('noKeyboard' in $$props) $$invalidate(28, noKeyboard = $$props.noKeyboard);
    		if ('noDrag' in $$props) $$invalidate(29, noDrag = $$props.noDrag);
    		if ('noDragEventsBubbling' in $$props) $$invalidate(30, noDragEventsBubbling = $$props.noDragEventsBubbling);
    		if ('containerClasses' in $$props) $$invalidate(2, containerClasses = $$props.containerClasses);
    		if ('containerStyles' in $$props) $$invalidate(3, containerStyles = $$props.containerStyles);
    		if ('disableDefaultStyles' in $$props) $$invalidate(4, disableDefaultStyles = $$props.disableDefaultStyles);
    		if ('name' in $$props) $$invalidate(5, name = $$props.name);
    		if ('$$scope' in $$props) $$invalidate(31, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fromEvent,
    		allFilesAccepted,
    		composeEventHandlers,
    		fileAccepted,
    		fileMatchSize,
    		isEvtWithFiles,
    		isIeOrEdge,
    		isPropagationStopped,
    		TOO_MANY_FILES_REJECTION,
    		onMount,
    		onDestroy,
    		createEventDispatcher,
    		accept,
    		disabled,
    		getFilesFromEvent,
    		maxSize,
    		minSize,
    		multiple,
    		preventDropOnDocument,
    		noClick,
    		noKeyboard,
    		noDrag,
    		noDragEventsBubbling,
    		containerClasses,
    		containerStyles,
    		disableDefaultStyles,
    		name,
    		dispatch,
    		state,
    		rootRef,
    		inputRef,
    		resetState,
    		openFileDialog,
    		onKeyDownCb,
    		onFocusCb,
    		onBlurCb,
    		onClickCb,
    		onDragEnterCb,
    		onDragOverCb,
    		onDragLeaveCb,
    		onDropCb,
    		composeHandler,
    		composeKeyboardHandler,
    		composeDragHandler,
    		stopPropagation,
    		onDocumentDragOver,
    		dragTargetsRef,
    		onDocumentDrop,
    		onWindowFocus,
    		onInputElementClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('accept' in $$props) $$invalidate(0, accept = $$props.accept);
    		if ('disabled' in $$props) $$invalidate(22, disabled = $$props.disabled);
    		if ('getFilesFromEvent' in $$props) $$invalidate(23, getFilesFromEvent = $$props.getFilesFromEvent);
    		if ('maxSize' in $$props) $$invalidate(24, maxSize = $$props.maxSize);
    		if ('minSize' in $$props) $$invalidate(25, minSize = $$props.minSize);
    		if ('multiple' in $$props) $$invalidate(1, multiple = $$props.multiple);
    		if ('preventDropOnDocument' in $$props) $$invalidate(26, preventDropOnDocument = $$props.preventDropOnDocument);
    		if ('noClick' in $$props) $$invalidate(27, noClick = $$props.noClick);
    		if ('noKeyboard' in $$props) $$invalidate(28, noKeyboard = $$props.noKeyboard);
    		if ('noDrag' in $$props) $$invalidate(29, noDrag = $$props.noDrag);
    		if ('noDragEventsBubbling' in $$props) $$invalidate(30, noDragEventsBubbling = $$props.noDragEventsBubbling);
    		if ('containerClasses' in $$props) $$invalidate(2, containerClasses = $$props.containerClasses);
    		if ('containerStyles' in $$props) $$invalidate(3, containerStyles = $$props.containerStyles);
    		if ('disableDefaultStyles' in $$props) $$invalidate(4, disableDefaultStyles = $$props.disableDefaultStyles);
    		if ('name' in $$props) $$invalidate(5, name = $$props.name);
    		if ('state' in $$props) state = $$props.state;
    		if ('rootRef' in $$props) $$invalidate(6, rootRef = $$props.rootRef);
    		if ('inputRef' in $$props) $$invalidate(7, inputRef = $$props.inputRef);
    		if ('dragTargetsRef' in $$props) dragTargetsRef = $$props.dragTargetsRef;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		accept,
    		multiple,
    		containerClasses,
    		containerStyles,
    		disableDefaultStyles,
    		name,
    		rootRef,
    		inputRef,
    		onKeyDownCb,
    		onFocusCb,
    		onBlurCb,
    		onClickCb,
    		onDragEnterCb,
    		onDragOverCb,
    		onDragLeaveCb,
    		onDropCb,
    		composeHandler,
    		composeKeyboardHandler,
    		composeDragHandler,
    		onDocumentDragOver,
    		onDocumentDrop,
    		onWindowFocus,
    		disabled,
    		getFilesFromEvent,
    		maxSize,
    		minSize,
    		preventDropOnDocument,
    		noClick,
    		noKeyboard,
    		noDrag,
    		noDragEventsBubbling,
    		$$scope,
    		slots,
    		input_binding,
    		div_binding
    	];
    }

    class Dropzone extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$q,
    			create_fragment$q,
    			safe_not_equal,
    			{
    				accept: 0,
    				disabled: 22,
    				getFilesFromEvent: 23,
    				maxSize: 24,
    				minSize: 25,
    				multiple: 1,
    				preventDropOnDocument: 26,
    				noClick: 27,
    				noKeyboard: 28,
    				noDrag: 29,
    				noDragEventsBubbling: 30,
    				containerClasses: 2,
    				containerStyles: 3,
    				disableDefaultStyles: 4,
    				name: 5
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dropzone",
    			options,
    			id: create_fragment$q.name
    		});
    	}

    	get accept() {
    		throw new Error("<Dropzone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set accept(value) {
    		throw new Error("<Dropzone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Dropzone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Dropzone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getFilesFromEvent() {
    		throw new Error("<Dropzone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getFilesFromEvent(value) {
    		throw new Error("<Dropzone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxSize() {
    		throw new Error("<Dropzone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxSize(value) {
    		throw new Error("<Dropzone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minSize() {
    		throw new Error("<Dropzone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minSize(value) {
    		throw new Error("<Dropzone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiple() {
    		throw new Error("<Dropzone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiple(value) {
    		throw new Error("<Dropzone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get preventDropOnDocument() {
    		throw new Error("<Dropzone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set preventDropOnDocument(value) {
    		throw new Error("<Dropzone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noClick() {
    		throw new Error("<Dropzone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noClick(value) {
    		throw new Error("<Dropzone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noKeyboard() {
    		throw new Error("<Dropzone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noKeyboard(value) {
    		throw new Error("<Dropzone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noDrag() {
    		throw new Error("<Dropzone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noDrag(value) {
    		throw new Error("<Dropzone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noDragEventsBubbling() {
    		throw new Error("<Dropzone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noDragEventsBubbling(value) {
    		throw new Error("<Dropzone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerClasses() {
    		throw new Error("<Dropzone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerClasses(value) {
    		throw new Error("<Dropzone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerStyles() {
    		throw new Error("<Dropzone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerStyles(value) {
    		throw new Error("<Dropzone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disableDefaultStyles() {
    		throw new Error("<Dropzone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disableDefaultStyles(value) {
    		throw new Error("<Dropzone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Dropzone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Dropzone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/carbon-components-svelte/src/Checkbox/CheckboxSkeleton.svelte generated by Svelte v3.55.1 */

    const file$p = "node_modules/carbon-components-svelte/src/Checkbox/CheckboxSkeleton.svelte";

    function create_fragment$p(ctx) {
    	let div;
    	let span;
    	let mounted;
    	let dispose;
    	let div_levels = [/*$$restProps*/ ctx[0]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			toggle_class(span, "bx--checkbox-label-text", true);
    			toggle_class(span, "bx--skeleton", true);
    			add_location(span, file$p, 11, 2, 248);
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--form-item", true);
    			toggle_class(div, "bx--checkbox-wrapper", true);
    			toggle_class(div, "bx--checkbox-label", true);
    			add_location(div, file$p, 1, 0, 57);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*click_handler*/ ctx[1], false, false, false),
    					listen_dev(div, "mouseover", /*mouseover_handler*/ ctx[2], false, false, false),
    					listen_dev(div, "mouseenter", /*mouseenter_handler*/ ctx[3], false, false, false),
    					listen_dev(div, "mouseleave", /*mouseleave_handler*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 1 && /*$$restProps*/ ctx[0]]));
    			toggle_class(div, "bx--form-item", true);
    			toggle_class(div, "bx--checkbox-wrapper", true);
    			toggle_class(div, "bx--checkbox-label", true);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
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
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CheckboxSkeleton', slots, []);

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
    	};

    	return [
    		$$restProps,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class CheckboxSkeleton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CheckboxSkeleton",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    var CheckboxSkeleton$1 = CheckboxSkeleton;

    /* node_modules/carbon-components-svelte/src/Checkbox/Checkbox.svelte generated by Svelte v3.55.1 */
    const file$o = "node_modules/carbon-components-svelte/src/Checkbox/Checkbox.svelte";
    const get_labelText_slot_changes$2 = dirty => ({});
    const get_labelText_slot_context$2 = ctx => ({});

    // (82:0) {:else}
    function create_else_block$2(ctx) {
    	let div;
    	let input;
    	let t;
    	let label;
    	let span;
    	let current;
    	let mounted;
    	let dispose;
    	const labelText_slot_template = /*#slots*/ ctx[19].labelText;
    	const labelText_slot = create_slot(labelText_slot_template, ctx, /*$$scope*/ ctx[18], get_labelText_slot_context$2);
    	const labelText_slot_or_fallback = labelText_slot || fallback_block$5(ctx);
    	let div_levels = [/*$$restProps*/ ctx[16]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t = space();
    			label = element("label");
    			span = element("span");
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.c();
    			attr_dev(input, "type", "checkbox");
    			input.value = /*value*/ ctx[4];
    			input.checked = /*checked*/ ctx[0];
    			input.disabled = /*disabled*/ ctx[9];
    			attr_dev(input, "id", /*id*/ ctx[13]);
    			input.indeterminate = /*indeterminate*/ ctx[5];
    			attr_dev(input, "name", /*name*/ ctx[12]);
    			input.required = /*required*/ ctx[7];
    			input.readOnly = /*readonly*/ ctx[8];
    			toggle_class(input, "bx--checkbox", true);
    			add_location(input, file$o, 91, 4, 2114);
    			toggle_class(span, "bx--checkbox-label-text", true);
    			toggle_class(span, "bx--visually-hidden", /*hideLabel*/ ctx[11]);
    			add_location(span, file$o, 116, 6, 2770);
    			attr_dev(label, "for", /*id*/ ctx[13]);
    			attr_dev(label, "title", /*title*/ ctx[2]);
    			toggle_class(label, "bx--checkbox-label", true);
    			add_location(label, file$o, 115, 4, 2695);
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--form-item", true);
    			toggle_class(div, "bx--checkbox-wrapper", true);
    			add_location(div, file$o, 82, 2, 1941);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			/*input_binding*/ ctx[30](input);
    			append_dev(div, t);
    			append_dev(div, label);
    			append_dev(label, span);

    			if (labelText_slot_or_fallback) {
    				labelText_slot_or_fallback.m(span, null);
    			}

    			/*span_binding*/ ctx[32](span);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*change_handler_1*/ ctx[31], false, false, false),
    					listen_dev(input, "change", /*change_handler*/ ctx[24], false, false, false),
    					listen_dev(input, "blur", /*blur_handler*/ ctx[25], false, false, false),
    					listen_dev(div, "click", /*click_handler_1*/ ctx[20], false, false, false),
    					listen_dev(div, "mouseover", /*mouseover_handler_1*/ ctx[21], false, false, false),
    					listen_dev(div, "mouseenter", /*mouseenter_handler_1*/ ctx[22], false, false, false),
    					listen_dev(div, "mouseleave", /*mouseleave_handler_1*/ ctx[23], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*value*/ 16) {
    				prop_dev(input, "value", /*value*/ ctx[4]);
    			}

    			if (!current || dirty[0] & /*checked*/ 1) {
    				prop_dev(input, "checked", /*checked*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*disabled*/ 512) {
    				prop_dev(input, "disabled", /*disabled*/ ctx[9]);
    			}

    			if (!current || dirty[0] & /*id*/ 8192) {
    				attr_dev(input, "id", /*id*/ ctx[13]);
    			}

    			if (!current || dirty[0] & /*indeterminate*/ 32) {
    				prop_dev(input, "indeterminate", /*indeterminate*/ ctx[5]);
    			}

    			if (!current || dirty[0] & /*name*/ 4096) {
    				attr_dev(input, "name", /*name*/ ctx[12]);
    			}

    			if (!current || dirty[0] & /*required*/ 128) {
    				prop_dev(input, "required", /*required*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*readonly*/ 256) {
    				prop_dev(input, "readOnly", /*readonly*/ ctx[8]);
    			}

    			if (labelText_slot) {
    				if (labelText_slot.p && (!current || dirty[0] & /*$$scope*/ 262144)) {
    					update_slot_base(
    						labelText_slot,
    						labelText_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(labelText_slot_template, /*$$scope*/ ctx[18], dirty, get_labelText_slot_changes$2),
    						get_labelText_slot_context$2
    					);
    				}
    			} else {
    				if (labelText_slot_or_fallback && labelText_slot_or_fallback.p && (!current || dirty[0] & /*labelText*/ 1024)) {
    					labelText_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*hideLabel*/ 2048) {
    				toggle_class(span, "bx--visually-hidden", /*hideLabel*/ ctx[11]);
    			}

    			if (!current || dirty[0] & /*id*/ 8192) {
    				attr_dev(label, "for", /*id*/ ctx[13]);
    			}

    			if (!current || dirty[0] & /*title*/ 4) {
    				attr_dev(label, "title", /*title*/ ctx[2]);
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty[0] & /*$$restProps*/ 65536 && /*$$restProps*/ ctx[16]]));
    			toggle_class(div, "bx--form-item", true);
    			toggle_class(div, "bx--checkbox-wrapper", true);
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
    			if (detaching) detach_dev(div);
    			/*input_binding*/ ctx[30](null);
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.d(detaching);
    			/*span_binding*/ ctx[32](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(82:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (74:0) {#if skeleton}
    function create_if_block$h(ctx) {
    	let checkboxskeleton;
    	let current;
    	const checkboxskeleton_spread_levels = [/*$$restProps*/ ctx[16]];
    	let checkboxskeleton_props = {};

    	for (let i = 0; i < checkboxskeleton_spread_levels.length; i += 1) {
    		checkboxskeleton_props = assign(checkboxskeleton_props, checkboxskeleton_spread_levels[i]);
    	}

    	checkboxskeleton = new CheckboxSkeleton$1({
    			props: checkboxskeleton_props,
    			$$inline: true
    		});

    	checkboxskeleton.$on("click", /*click_handler*/ ctx[26]);
    	checkboxskeleton.$on("mouseover", /*mouseover_handler*/ ctx[27]);
    	checkboxskeleton.$on("mouseenter", /*mouseenter_handler*/ ctx[28]);
    	checkboxskeleton.$on("mouseleave", /*mouseleave_handler*/ ctx[29]);

    	const block = {
    		c: function create() {
    			create_component(checkboxskeleton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkboxskeleton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const checkboxskeleton_changes = (dirty[0] & /*$$restProps*/ 65536)
    			? get_spread_update(checkboxskeleton_spread_levels, [get_spread_object(/*$$restProps*/ ctx[16])])
    			: {};

    			checkboxskeleton.$set(checkboxskeleton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkboxskeleton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkboxskeleton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkboxskeleton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$h.name,
    		type: "if",
    		source: "(74:0) {#if skeleton}",
    		ctx
    	});

    	return block;
    }

    // (122:31)
    function fallback_block$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*labelText*/ ctx[10]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*labelText*/ 1024) set_data_dev(t, /*labelText*/ ctx[10]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$5.name,
    		type: "fallback",
    		source: "(122:31)            ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$h, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*skeleton*/ ctx[6]) return 0;
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
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let useGroup;
    	let isTruncated;

    	const omit_props_names = [
    		"value","checked","group","indeterminate","skeleton","required","readonly","disabled","labelText","hideLabel","name","title","id","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Checkbox', slots, ['labelText']);
    	let { value = "" } = $$props;
    	let { checked = false } = $$props;
    	let { group = undefined } = $$props;
    	let { indeterminate = false } = $$props;
    	let { skeleton = false } = $$props;
    	let { required = false } = $$props;
    	let { readonly = false } = $$props;
    	let { disabled = false } = $$props;
    	let { labelText = "" } = $$props;
    	let { hideLabel = false } = $$props;
    	let { name = "" } = $$props;
    	let { title = undefined } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { ref = null } = $$props;
    	const dispatch = createEventDispatcher();
    	let refLabel = null;

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

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
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

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(3, ref);
    		});
    	}

    	const change_handler_1 = () => {
    		if (useGroup) {
    			$$invalidate(1, group = group.includes(value)
    			? group.filter(_value => _value !== value)
    			: [...group, value]);
    		} else {
    			$$invalidate(0, checked = !checked);
    		}
    	};

    	function span_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			refLabel = $$value;
    			$$invalidate(14, refLabel);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(16, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('value' in $$new_props) $$invalidate(4, value = $$new_props.value);
    		if ('checked' in $$new_props) $$invalidate(0, checked = $$new_props.checked);
    		if ('group' in $$new_props) $$invalidate(1, group = $$new_props.group);
    		if ('indeterminate' in $$new_props) $$invalidate(5, indeterminate = $$new_props.indeterminate);
    		if ('skeleton' in $$new_props) $$invalidate(6, skeleton = $$new_props.skeleton);
    		if ('required' in $$new_props) $$invalidate(7, required = $$new_props.required);
    		if ('readonly' in $$new_props) $$invalidate(8, readonly = $$new_props.readonly);
    		if ('disabled' in $$new_props) $$invalidate(9, disabled = $$new_props.disabled);
    		if ('labelText' in $$new_props) $$invalidate(10, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$new_props) $$invalidate(11, hideLabel = $$new_props.hideLabel);
    		if ('name' in $$new_props) $$invalidate(12, name = $$new_props.name);
    		if ('title' in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ('id' in $$new_props) $$invalidate(13, id = $$new_props.id);
    		if ('ref' in $$new_props) $$invalidate(3, ref = $$new_props.ref);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		value,
    		checked,
    		group,
    		indeterminate,
    		skeleton,
    		required,
    		readonly,
    		disabled,
    		labelText,
    		hideLabel,
    		name,
    		title,
    		id,
    		ref,
    		createEventDispatcher,
    		CheckboxSkeleton: CheckboxSkeleton$1,
    		dispatch,
    		refLabel,
    		isTruncated,
    		useGroup
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('value' in $$props) $$invalidate(4, value = $$new_props.value);
    		if ('checked' in $$props) $$invalidate(0, checked = $$new_props.checked);
    		if ('group' in $$props) $$invalidate(1, group = $$new_props.group);
    		if ('indeterminate' in $$props) $$invalidate(5, indeterminate = $$new_props.indeterminate);
    		if ('skeleton' in $$props) $$invalidate(6, skeleton = $$new_props.skeleton);
    		if ('required' in $$props) $$invalidate(7, required = $$new_props.required);
    		if ('readonly' in $$props) $$invalidate(8, readonly = $$new_props.readonly);
    		if ('disabled' in $$props) $$invalidate(9, disabled = $$new_props.disabled);
    		if ('labelText' in $$props) $$invalidate(10, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$props) $$invalidate(11, hideLabel = $$new_props.hideLabel);
    		if ('name' in $$props) $$invalidate(12, name = $$new_props.name);
    		if ('title' in $$props) $$invalidate(2, title = $$new_props.title);
    		if ('id' in $$props) $$invalidate(13, id = $$new_props.id);
    		if ('ref' in $$props) $$invalidate(3, ref = $$new_props.ref);
    		if ('refLabel' in $$props) $$invalidate(14, refLabel = $$new_props.refLabel);
    		if ('isTruncated' in $$props) $$invalidate(17, isTruncated = $$new_props.isTruncated);
    		if ('useGroup' in $$props) $$invalidate(15, useGroup = $$new_props.useGroup);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*group*/ 2) {
    			$$invalidate(15, useGroup = Array.isArray(group));
    		}

    		if ($$self.$$.dirty[0] & /*useGroup, group, value, checked*/ 32787) {
    			$$invalidate(0, checked = useGroup ? group.includes(value) : checked);
    		}

    		if ($$self.$$.dirty[0] & /*checked*/ 1) {
    			dispatch("check", checked);
    		}

    		if ($$self.$$.dirty[0] & /*refLabel*/ 16384) {
    			$$invalidate(17, isTruncated = refLabel?.offsetWidth < refLabel?.scrollWidth);
    		}

    		if ($$self.$$.dirty[0] & /*title, isTruncated, refLabel*/ 147460) {
    			$$invalidate(2, title = !title && isTruncated ? refLabel?.innerText : title);
    		}
    	};

    	return [
    		checked,
    		group,
    		title,
    		ref,
    		value,
    		indeterminate,
    		skeleton,
    		required,
    		readonly,
    		disabled,
    		labelText,
    		hideLabel,
    		name,
    		id,
    		refLabel,
    		useGroup,
    		$$restProps,
    		isTruncated,
    		$$scope,
    		slots,
    		click_handler_1,
    		mouseover_handler_1,
    		mouseenter_handler_1,
    		mouseleave_handler_1,
    		change_handler,
    		blur_handler,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		input_binding,
    		change_handler_1,
    		span_binding
    	];
    }

    class Checkbox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$o,
    			create_fragment$o,
    			safe_not_equal,
    			{
    				value: 4,
    				checked: 0,
    				group: 1,
    				indeterminate: 5,
    				skeleton: 6,
    				required: 7,
    				readonly: 8,
    				disabled: 9,
    				labelText: 10,
    				hideLabel: 11,
    				name: 12,
    				title: 2,
    				id: 13,
    				ref: 3
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Checkbox",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get value() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checked() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get indeterminate() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set indeterminate(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skeleton() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skeleton(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get required() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set required(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readonly() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readonly(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelText() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelText(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideLabel() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideLabel(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Checkbox$1 = Checkbox;

    /* node_modules/carbon-components-svelte/src/icons/Checkmark.svelte generated by Svelte v3.55.1 */

    const file$n = "node_modules/carbon-components-svelte/src/icons/Checkmark.svelte";

    // (24:2) {#if title}
    function create_if_block$g(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$n, 23, 13, 549);
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

    function create_fragment$n(ctx) {
    	let svg;
    	let path;
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
    			path = svg_element("path");
    			attr_dev(path, "d", "M13 24L4 15 5.414 13.586 13 21.171 26.586 7.586 28 9 13 24z");
    			add_location(path, file$n, 24, 2, 579);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$n, 13, 0, 338);
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
    					if_block = create_if_block$g(ctx);
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
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Checkmark', slots, []);
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

    class Checkmark extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Checkmark",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get size() {
    		throw new Error("<Checkmark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Checkmark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Checkmark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Checkmark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Checkmark$1 = Checkmark;

    /* node_modules/carbon-components-svelte/src/icons/WarningFilled.svelte generated by Svelte v3.55.1 */

    const file$m = "node_modules/carbon-components-svelte/src/icons/WarningFilled.svelte";

    // (24:2) {#if title}
    function create_if_block$f(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$m, 23, 13, 549);
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

    function create_fragment$m(ctx) {
    	let svg;
    	let path0;
    	let path1;
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
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14C30,8.3,23.7,2,16,2z M14.9,8h2.2v11h-2.2V8z M16,25\tc-0.8,0-1.5-0.7-1.5-1.5S15.2,22,16,22c0.8,0,1.5,0.7,1.5,1.5S16.8,25,16,25z");
    			add_location(path0, file$m, 24, 2, 579);
    			attr_dev(path1, "fill", "none");
    			attr_dev(path1, "d", "M17.5,23.5c0,0.8-0.7,1.5-1.5,1.5c-0.8,0-1.5-0.7-1.5-1.5S15.2,22,16,22\tC16.8,22,17.5,22.7,17.5,23.5z M17.1,8h-2.2v11h2.2V8z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$m, 26, 10, 777);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$m, 13, 0, 338);
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
    					if_block = create_if_block$f(ctx);
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
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WarningFilled",
    			options,
    			id: create_fragment$m.name
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

    const file$l = "node_modules/carbon-components-svelte/src/icons/WarningAltFilled.svelte";

    // (24:2) {#if title}
    function create_if_block$e(ctx) {
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
    		id: create_if_block$e.name,
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
    	let path2;
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
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "d", "M16,26a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,26Zm-1.125-5h2.25V12h-2.25Z");
    			attr_dev(path0, "data-icon-path", "inner-path");
    			add_location(path0, file$l, 24, 2, 579);
    			attr_dev(path1, "d", "M16.002,6.1714h-.004L4.6487,27.9966,4.6506,28H27.3494l.0019-.0034ZM14.875,12h2.25v9h-2.25ZM16,26a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,26Z");
    			add_location(path1, file$l, 27, 39, 722);
    			attr_dev(path2, "d", "M29,30H3a1,1,0,0,1-.8872-1.4614l13-25a1,1,0,0,1,1.7744,0l13,25A1,1,0,0,1,29,30ZM4.6507,28H27.3493l.002-.0033L16.002,6.1714h-.004L4.6487,27.9967Z");
    			add_location(path2, file$l, 29, 10, 886);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$l, 13, 0, 338);
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
    					if_block = create_if_block$e(ctx);
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
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WarningAltFilled",
    			options,
    			id: create_fragment$l.name
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

    const file$k = "node_modules/carbon-components-svelte/src/ListBox/ListBox.svelte";

    // (59:0) {#if invalid}
    function create_if_block_1$8(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*invalidText*/ ctx[6]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$k, 59, 2, 1374);
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
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(59:0) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (62:0) {#if !invalid && warn}
    function create_if_block$d(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*warnText*/ ctx[8]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$k, 62, 2, 1466);
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
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(62:0) {#if !invalid && warn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
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

    	let if_block0 = /*invalid*/ ctx[5] && create_if_block_1$8(ctx);
    	let if_block1 = !/*invalid*/ ctx[5] && /*warn*/ ctx[7] && create_if_block$d(ctx);

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
    			add_location(div, file$k, 35, 0, 769);
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
    					if_block0 = create_if_block_1$8(ctx);
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
    					if_block1 = create_if_block$d(ctx);
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
    		id: create_fragment$k.name,
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

    function instance$k($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {
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
    			id: create_fragment$k.name
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

    /* node_modules/carbon-components-svelte/src/ListBox/ListBoxField.svelte generated by Svelte v3.55.1 */
    const file$j = "node_modules/carbon-components-svelte/src/ListBox/ListBoxField.svelte";

    function create_fragment$j(ctx) {
    	let div;
    	let div_aria_owns_value;
    	let div_aria_controls_value;
    	let div_aria_label_value;
    	let div_tabindex_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

    	let div_levels = [
    		{ role: /*role*/ ctx[2] },
    		{ "aria-expanded": /*ariaExpanded*/ ctx[6] },
    		{
    			"aria-owns": div_aria_owns_value = /*ariaExpanded*/ ctx[6] && /*menuId*/ ctx[5] || undefined
    		},
    		{
    			"aria-controls": div_aria_controls_value = /*ariaExpanded*/ ctx[6] && /*menuId*/ ctx[5] || undefined
    		},
    		{ "aria-disabled": /*disabled*/ ctx[1] },
    		{
    			"aria-label": div_aria_label_value = /*ariaExpanded*/ ctx[6]
    			? /*translateWithId*/ ctx[4]('close')
    			: /*translateWithId*/ ctx[4]('open')
    		},
    		{
    			tabindex: div_tabindex_value = /*disabled*/ ctx[1] ? '-1' : /*tabindex*/ ctx[3]
    		},
    		/*$$restProps*/ ctx[7]
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
    			toggle_class(div, "bx--list-box__field", true);
    			add_location(div, file$j, 46, 0, 1167);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[19](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(div, "mouseover", /*mouseover_handler*/ ctx[13], false, false, false),
    					listen_dev(div, "mouseenter", /*mouseenter_handler*/ ctx[14], false, false, false),
    					listen_dev(div, "mouseleave", /*mouseleave_handler*/ ctx[15], false, false, false),
    					listen_dev(div, "keydown", stop_propagation(/*keydown_handler*/ ctx[16]), false, false, true),
    					listen_dev(div, "focus", /*focus_handler*/ ctx[17], false, false, false),
    					listen_dev(div, "blur", /*blur_handler*/ ctx[18], false, false, false)
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
    				(!current || dirty & /*role*/ 4) && { role: /*role*/ ctx[2] },
    				(!current || dirty & /*ariaExpanded*/ 64) && { "aria-expanded": /*ariaExpanded*/ ctx[6] },
    				(!current || dirty & /*ariaExpanded, menuId*/ 96 && div_aria_owns_value !== (div_aria_owns_value = /*ariaExpanded*/ ctx[6] && /*menuId*/ ctx[5] || undefined)) && { "aria-owns": div_aria_owns_value },
    				(!current || dirty & /*ariaExpanded, menuId*/ 96 && div_aria_controls_value !== (div_aria_controls_value = /*ariaExpanded*/ ctx[6] && /*menuId*/ ctx[5] || undefined)) && { "aria-controls": div_aria_controls_value },
    				(!current || dirty & /*disabled*/ 2) && { "aria-disabled": /*disabled*/ ctx[1] },
    				(!current || dirty & /*ariaExpanded, translateWithId*/ 80 && div_aria_label_value !== (div_aria_label_value = /*ariaExpanded*/ ctx[6]
    				? /*translateWithId*/ ctx[4]('close')
    				: /*translateWithId*/ ctx[4]('open'))) && { "aria-label": div_aria_label_value },
    				(!current || dirty & /*disabled, tabindex*/ 10 && div_tabindex_value !== (div_tabindex_value = /*disabled*/ ctx[1] ? '-1' : /*tabindex*/ ctx[3])) && { tabindex: div_tabindex_value },
    				dirty & /*$$restProps*/ 128 && /*$$restProps*/ ctx[7]
    			]));

    			toggle_class(div, "bx--list-box__field", true);
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
    			/*div_binding*/ ctx[19](null);
    			mounted = false;
    			run_all(dispose);
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
    	let ariaExpanded;
    	let menuId;
    	const omit_props_names = ["disabled","role","tabindex","translationIds","translateWithId","id","ref"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ListBoxField', slots, ['default']);
    	let { disabled = false } = $$props;
    	let { role = "combobox" } = $$props;
    	let { tabindex = "-1" } = $$props;
    	const translationIds = { close: "close", open: "open" };
    	let { translateWithId = id => defaultTranslations[id] } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { ref = null } = $$props;

    	const defaultTranslations = {
    		[translationIds.close]: "Close menu",
    		[translationIds.open]: "Open menu"
    	};

    	const ctx = getContext("MultiSelect");

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

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(22, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('disabled' in $$new_props) $$invalidate(1, disabled = $$new_props.disabled);
    		if ('role' in $$new_props) $$invalidate(2, role = $$new_props.role);
    		if ('tabindex' in $$new_props) $$invalidate(3, tabindex = $$new_props.tabindex);
    		if ('translateWithId' in $$new_props) $$invalidate(4, translateWithId = $$new_props.translateWithId);
    		if ('id' in $$new_props) $$invalidate(9, id = $$new_props.id);
    		if ('ref' in $$new_props) $$invalidate(0, ref = $$new_props.ref);
    		if ('$$scope' in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		disabled,
    		role,
    		tabindex,
    		translationIds,
    		translateWithId,
    		id,
    		ref,
    		getContext,
    		defaultTranslations,
    		ctx,
    		menuId,
    		ariaExpanded
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(22, $$props = assign(assign({}, $$props), $$new_props));
    		if ('disabled' in $$props) $$invalidate(1, disabled = $$new_props.disabled);
    		if ('role' in $$props) $$invalidate(2, role = $$new_props.role);
    		if ('tabindex' in $$props) $$invalidate(3, tabindex = $$new_props.tabindex);
    		if ('translateWithId' in $$props) $$invalidate(4, translateWithId = $$new_props.translateWithId);
    		if ('id' in $$props) $$invalidate(9, id = $$new_props.id);
    		if ('ref' in $$props) $$invalidate(0, ref = $$new_props.ref);
    		if ('menuId' in $$props) $$invalidate(5, menuId = $$new_props.menuId);
    		if ('ariaExpanded' in $$props) $$invalidate(6, ariaExpanded = $$new_props.ariaExpanded);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*ref*/ 1) {
    			if (ctx && ref) {
    				ctx.declareRef({ key: "field", ref });
    			}
    		}

    		$$invalidate(6, ariaExpanded = $$props["aria-expanded"]);

    		if ($$self.$$.dirty & /*id*/ 512) {
    			$$invalidate(5, menuId = `menu-${id}`);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		ref,
    		disabled,
    		role,
    		tabindex,
    		translateWithId,
    		menuId,
    		ariaExpanded,
    		$$restProps,
    		translationIds,
    		id,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keydown_handler,
    		focus_handler,
    		blur_handler,
    		div_binding
    	];
    }

    class ListBoxField extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
    			disabled: 1,
    			role: 2,
    			tabindex: 3,
    			translationIds: 8,
    			translateWithId: 4,
    			id: 9,
    			ref: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListBoxField",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get disabled() {
    		throw new Error("<ListBoxField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<ListBoxField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get role() {
    		throw new Error("<ListBoxField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set role(value) {
    		throw new Error("<ListBoxField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<ListBoxField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<ListBoxField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translationIds() {
    		return this.$$.ctx[8];
    	}

    	set translationIds(value) {
    		throw new Error("<ListBoxField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translateWithId() {
    		throw new Error("<ListBoxField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set translateWithId(value) {
    		throw new Error("<ListBoxField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<ListBoxField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<ListBoxField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<ListBoxField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<ListBoxField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ListBoxField$1 = ListBoxField;

    /* node_modules/carbon-components-svelte/src/ListBox/ListBoxMenu.svelte generated by Svelte v3.55.1 */

    const file$i = "node_modules/carbon-components-svelte/src/ListBox/ListBoxMenu.svelte";

    function create_fragment$i(ctx) {
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
    			add_location(div, file$i, 8, 0, 194);
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
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { id: 1, ref: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListBoxMenu",
    			options,
    			id: create_fragment$i.name
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

    const file$h = "node_modules/carbon-components-svelte/src/icons/ChevronDown.svelte";

    // (24:2) {#if title}
    function create_if_block$c(ctx) {
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
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let svg;
    	let path;
    	let if_block = /*title*/ ctx[1] && create_if_block$c(ctx);

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
    			add_location(path, file$h, 24, 2, 579);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$h, 13, 0, 338);
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
    					if_block = create_if_block$c(ctx);
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
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChevronDown",
    			options,
    			id: create_fragment$h.name
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
    const file$g = "node_modules/carbon-components-svelte/src/ListBox/ListBoxMenuIcon.svelte";

    function create_fragment$g(ctx) {
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
    			add_location(div, file$g, 29, 0, 799);
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
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			open: 0,
    			translationIds: 3,
    			translateWithId: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListBoxMenuIcon",
    			options,
    			id: create_fragment$g.name
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

    const file$f = "node_modules/carbon-components-svelte/src/ListBox/ListBoxMenuItem.svelte";

    function create_fragment$f(ctx) {
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
    			add_location(div0, file$f, 32, 2, 897);
    			set_attributes(div1, div1_data);
    			toggle_class(div1, "bx--list-box__menu-item", true);
    			toggle_class(div1, "bx--list-box__menu-item--active", /*active*/ ctx[0]);
    			toggle_class(div1, "bx--list-box__menu-item--highlighted", /*highlighted*/ ctx[1] || /*active*/ ctx[0]);
    			add_location(div1, file$f, 20, 0, 577);
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
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { active: 0, highlighted: 1, disabled: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListBoxMenuItem",
    			options,
    			id: create_fragment$f.name
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

    const file$e = "node_modules/carbon-components-svelte/src/icons/Close.svelte";

    // (24:2) {#if title}
    function create_if_block$b(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$e, 23, 13, 549);
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

    function create_fragment$e(ctx) {
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
    			attr_dev(path, "d", "M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z");
    			add_location(path, file$e, 24, 2, 579);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$e, 13, 0, 338);
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
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Close",
    			options,
    			id: create_fragment$e.name
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

    /* node_modules/carbon-components-svelte/src/ListBox/ListBoxSelection.svelte generated by Svelte v3.55.1 */
    const file$d = "node_modules/carbon-components-svelte/src/ListBox/ListBoxSelection.svelte";

    // (84:0) {:else}
    function create_else_block$1(ctx) {
    	let div;
    	let t;
    	let close;
    	let div_tabindex_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*selectionCount*/ ctx[1] !== undefined && create_if_block_1$7(ctx);
    	close = new Close$1({ $$inline: true });

    	let div_levels = [
    		{ role: "button" },
    		{ "aria-label": /*description*/ ctx[4] },
    		{ title: /*description*/ ctx[4] },
    		{
    			tabindex: div_tabindex_value = /*disabled*/ ctx[2] ? '-1' : '0'
    		},
    		/*$$restProps*/ ctx[6]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			create_component(close.$$.fragment);
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--list-box__selection", true);
    			toggle_class(div, "bx--tag--filter", /*selectionCount*/ ctx[1]);
    			toggle_class(div, "bx--list-box__selection--multi", /*selectionCount*/ ctx[1]);
    			add_location(div, file$d, 84, 2, 2189);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);
    			mount_component(close, div, null);
    			/*div_binding*/ ctx[12](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", stop_propagation(prevent_default(/*click_handler_1*/ ctx[13])), false, true, true),
    					listen_dev(div, "keydown", stop_propagation(/*keydown_handler_1*/ ctx[14]), false, false, true)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*selectionCount*/ ctx[1] !== undefined) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$7(ctx);
    					if_block.c();
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				{ role: "button" },
    				(!current || dirty & /*description*/ 16) && { "aria-label": /*description*/ ctx[4] },
    				(!current || dirty & /*description*/ 16) && { title: /*description*/ ctx[4] },
    				(!current || dirty & /*disabled*/ 4 && div_tabindex_value !== (div_tabindex_value = /*disabled*/ ctx[2] ? '-1' : '0')) && { tabindex: div_tabindex_value },
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));

    			toggle_class(div, "bx--list-box__selection", true);
    			toggle_class(div, "bx--tag--filter", /*selectionCount*/ ctx[1]);
    			toggle_class(div, "bx--list-box__selection--multi", /*selectionCount*/ ctx[1]);
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
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			destroy_component(close);
    			/*div_binding*/ ctx[12](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(84:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (52:0) {#if selectionCount !== undefined}
    function create_if_block$a(ctx) {
    	let div1;
    	let span;
    	let t0;
    	let t1;
    	let div0;
    	let close;
    	let div0_tabindex_value;
    	let current;
    	let mounted;
    	let dispose;
    	close = new Close$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span = element("span");
    			t0 = text(/*selectionCount*/ ctx[1]);
    			t1 = space();
    			div0 = element("div");
    			create_component(close.$$.fragment);
    			attr_dev(span, "title", /*selectionCount*/ ctx[1]);
    			toggle_class(span, "bx--tag__label", true);
    			add_location(span, file$d, 58, 4, 1532);
    			attr_dev(div0, "role", "button");
    			attr_dev(div0, "tabindex", div0_tabindex_value = /*disabled*/ ctx[2] ? -1 : 0);
    			attr_dev(div0, "disabled", /*disabled*/ ctx[2]);
    			attr_dev(div0, "aria-label", /*translationIds*/ ctx[3].clearAll);
    			attr_dev(div0, "title", /*description*/ ctx[4]);
    			toggle_class(div0, "bx--tag__close-icon", true);
    			add_location(div0, file$d, 61, 4, 1633);
    			toggle_class(div1, "bx--tag", true);
    			toggle_class(div1, "bx--tag--filter", true);
    			toggle_class(div1, "bx--tag--high-contrast", true);
    			toggle_class(div1, "bx--tag--disabled", /*disabled*/ ctx[2]);
    			add_location(div1, file$d, 52, 2, 1374);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span);
    			append_dev(span, t0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(close, div0, null);
    			/*div0_binding*/ ctx[9](div0);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", stop_propagation(prevent_default(/*click_handler*/ ctx[10])), false, true, true),
    					listen_dev(div0, "keydown", stop_propagation(/*keydown_handler*/ ctx[11]), false, false, true)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*selectionCount*/ 2) set_data_dev(t0, /*selectionCount*/ ctx[1]);

    			if (!current || dirty & /*selectionCount*/ 2) {
    				attr_dev(span, "title", /*selectionCount*/ ctx[1]);
    			}

    			if (!current || dirty & /*disabled*/ 4 && div0_tabindex_value !== (div0_tabindex_value = /*disabled*/ ctx[2] ? -1 : 0)) {
    				attr_dev(div0, "tabindex", div0_tabindex_value);
    			}

    			if (!current || dirty & /*disabled*/ 4) {
    				attr_dev(div0, "disabled", /*disabled*/ ctx[2]);
    			}

    			if (!current || dirty & /*description*/ 16) {
    				attr_dev(div0, "title", /*description*/ ctx[4]);
    			}

    			if (!current || dirty & /*disabled*/ 4) {
    				toggle_class(div1, "bx--tag--disabled", /*disabled*/ ctx[2]);
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
    			if (detaching) detach_dev(div1);
    			destroy_component(close);
    			/*div0_binding*/ ctx[9](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(52:0) {#if selectionCount !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (106:4) {#if selectionCount !== undefined}
    function create_if_block_1$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*selectionCount*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectionCount*/ 2) set_data_dev(t, /*selectionCount*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(106:4) {#if selectionCount !== undefined}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$a, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*selectionCount*/ ctx[1] !== undefined) return 0;
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
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let translationId;
    	let description;
    	const omit_props_names = ["selectionCount","disabled","translationIds","translateWithId","ref"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ListBoxSelection', slots, []);
    	let { selectionCount = undefined } = $$props;
    	let { disabled = false } = $$props;

    	const translationIds = {
    		clearAll: "clearAll",
    		clearSelection: "clearSelection"
    	};

    	let { translateWithId = id => defaultTranslations[id] } = $$props;
    	let { ref = null } = $$props;

    	const defaultTranslations = {
    		[translationIds.clearAll]: "Clear all selected items",
    		[translationIds.clearSelection]: "Clear selected item"
    	};

    	const dispatch = createEventDispatcher();
    	const ctx = getContext("MultiSelect");

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	const click_handler = e => {
    		if (!disabled) {
    			dispatch('clear', e);
    		}
    	};

    	const keydown_handler = e => {
    		if (!disabled && e.key === 'Enter') {
    			dispatch('clear', e);
    		}
    	};

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	const click_handler_1 = e => {
    		if (!disabled) {
    			dispatch('clear', e);
    		}
    	};

    	const keydown_handler_1 = e => {
    		if (!disabled && e.key === 'Enter') {
    			dispatch('clear', e);
    		}
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('selectionCount' in $$new_props) $$invalidate(1, selectionCount = $$new_props.selectionCount);
    		if ('disabled' in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('translateWithId' in $$new_props) $$invalidate(7, translateWithId = $$new_props.translateWithId);
    		if ('ref' in $$new_props) $$invalidate(0, ref = $$new_props.ref);
    	};

    	$$self.$capture_state = () => ({
    		selectionCount,
    		disabled,
    		translationIds,
    		translateWithId,
    		ref,
    		createEventDispatcher,
    		getContext,
    		Close: Close$1,
    		defaultTranslations,
    		dispatch,
    		ctx,
    		translationId,
    		description
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('selectionCount' in $$props) $$invalidate(1, selectionCount = $$new_props.selectionCount);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('translateWithId' in $$props) $$invalidate(7, translateWithId = $$new_props.translateWithId);
    		if ('ref' in $$props) $$invalidate(0, ref = $$new_props.ref);
    		if ('translationId' in $$props) $$invalidate(8, translationId = $$new_props.translationId);
    		if ('description' in $$props) $$invalidate(4, description = $$new_props.description);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*ref*/ 1) {
    			if (ctx && ref) {
    				ctx.declareRef({ key: "selection", ref });
    			}
    		}

    		if ($$self.$$.dirty & /*selectionCount*/ 2) {
    			$$invalidate(8, translationId = selectionCount
    			? translationIds.clearAll
    			: translationIds.clearSelection);
    		}

    		if ($$self.$$.dirty & /*translateWithId, translationId*/ 384) {
    			$$invalidate(4, description = translateWithId?.(translationId) ?? defaultTranslations[translationId]);
    		}
    	};

    	return [
    		ref,
    		selectionCount,
    		disabled,
    		translationIds,
    		description,
    		dispatch,
    		$$restProps,
    		translateWithId,
    		translationId,
    		div0_binding,
    		click_handler,
    		keydown_handler,
    		div_binding,
    		click_handler_1,
    		keydown_handler_1
    	];
    }

    class ListBoxSelection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			selectionCount: 1,
    			disabled: 2,
    			translationIds: 3,
    			translateWithId: 7,
    			ref: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListBoxSelection",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get selectionCount() {
    		throw new Error("<ListBoxSelection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectionCount(value) {
    		throw new Error("<ListBoxSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<ListBoxSelection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<ListBoxSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translationIds() {
    		return this.$$.ctx[3];
    	}

    	set translationIds(value) {
    		throw new Error("<ListBoxSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translateWithId() {
    		throw new Error("<ListBoxSelection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set translateWithId(value) {
    		throw new Error("<ListBoxSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<ListBoxSelection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<ListBoxSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ListBoxSelection$1 = ListBoxSelection;

    /* node_modules/carbon-components-svelte/src/ComboBox/ComboBox.svelte generated by Svelte v3.55.1 */
    const file$c = "node_modules/carbon-components-svelte/src/ComboBox/ComboBox.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[56] = list[i];
    	child_ctx[58] = i;
    	return child_ctx;
    }

    const get_default_slot_changes$1 = dirty => ({
    	item: dirty[0] & /*filteredItems*/ 16777216,
    	index: dirty[0] & /*filteredItems*/ 16777216
    });

    const get_default_slot_context$1 = ctx => ({
    	item: /*item*/ ctx[56],
    	index: /*i*/ ctx[58]
    });

    // (221:2) {#if titleText}
    function create_if_block_6$1(ctx) {
    	let label;
    	let t;

    	const block = {
    		c: function create() {
    			label = element("label");
    			t = text(/*titleText*/ ctx[9]);
    			attr_dev(label, "for", /*id*/ ctx[19]);
    			toggle_class(label, "bx--label", true);
    			toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[8]);
    			add_location(label, file$c, 221, 4, 6115);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*titleText*/ 512) set_data_dev(t, /*titleText*/ ctx[9]);

    			if (dirty[0] & /*id*/ 524288) {
    				attr_dev(label, "for", /*id*/ ctx[19]);
    			}

    			if (dirty[0] & /*disabled*/ 256) {
    				toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[8]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(221:2) {#if titleText}",
    		ctx
    	});

    	return block;
    }

    // (347:6) {#if invalid}
    function create_if_block_5$1(ctx) {
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
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(347:6) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (350:6) {#if !invalid && warn}
    function create_if_block_4$2(ctx) {
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
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(350:6) {#if !invalid && warn}",
    		ctx
    	});

    	return block;
    }

    // (355:6) {#if value}
    function create_if_block_3$3(ctx) {
    	let listboxselection;
    	let current;

    	listboxselection = new ListBoxSelection$1({
    			props: {
    				translateWithId: /*translateWithIdSelection*/ ctx[18],
    				disabled: /*disabled*/ ctx[8],
    				open: /*open*/ ctx[2]
    			},
    			$$inline: true
    		});

    	listboxselection.$on("clear", /*clear_handler*/ ctx[46]);
    	listboxselection.$on("clear", /*clear*/ ctx[21]);

    	const block = {
    		c: function create() {
    			create_component(listboxselection.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(listboxselection, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const listboxselection_changes = {};
    			if (dirty[0] & /*translateWithIdSelection*/ 262144) listboxselection_changes.translateWithId = /*translateWithIdSelection*/ ctx[18];
    			if (dirty[0] & /*disabled*/ 256) listboxselection_changes.disabled = /*disabled*/ ctx[8];
    			if (dirty[0] & /*open*/ 4) listboxselection_changes.open = /*open*/ ctx[2];
    			listboxselection.$set(listboxselection_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(listboxselection.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(listboxselection.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(listboxselection, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(355:6) {#if value}",
    		ctx
    	});

    	return block;
    }

    // (244:4) <ListBoxField       role="button"       aria-expanded="{open}"       on:click="{async () => {         if (disabled) return;         open = true;         await tick();         ref.focus();       }}"       id="{id}"       disabled="{disabled}"       translateWithId="{translateWithId}"     >
    function create_default_slot_3$1(ctx) {
    	let input;
    	let input_aria_controls_value;
    	let input_aria_owns_value;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let listboxmenuicon;
    	let current;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		{ tabindex: "0" },
    		{ autocomplete: "off" },
    		{ "aria-autocomplete": "list" },
    		{ "aria-expanded": /*open*/ ctx[2] },
    		{
    			"aria-activedescendant": /*highlightedId*/ ctx[25]
    		},
    		{ "aria-labelledby": /*comboId*/ ctx[26] },
    		{ "aria-disabled": /*disabled*/ ctx[8] },
    		{
    			"aria-controls": input_aria_controls_value = /*open*/ ctx[2] ? /*menuId*/ ctx[27] : undefined
    		},
    		{
    			"aria-owns": input_aria_owns_value = /*open*/ ctx[2] ? /*menuId*/ ctx[27] : undefined
    		},
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[10] },
    		{ id: /*id*/ ctx[19] },
    		{ name: /*name*/ ctx[20] },
    		/*$$restProps*/ ctx[30]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	let if_block0 = /*invalid*/ ctx[13] && create_if_block_5$1(ctx);
    	let if_block1 = !/*invalid*/ ctx[13] && /*warn*/ ctx[14] && create_if_block_4$2(ctx);
    	let if_block2 = /*value*/ ctx[1] && create_if_block_3$3(ctx);

    	listboxmenuicon = new ListBoxMenuIcon$1({
    			props: {
    				translateWithId: /*translateWithId*/ ctx[17],
    				open: /*open*/ ctx[2]
    			},
    			$$inline: true
    		});

    	listboxmenuicon.$on("click", /*click_handler_1*/ ctx[47]);

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			create_component(listboxmenuicon.$$.fragment);
    			set_attributes(input, input_data);
    			toggle_class(input, "bx--text-input", true);
    			toggle_class(input, "bx--text-input--light", /*light*/ ctx[16]);
    			toggle_class(input, "bx--text-input--empty", /*value*/ ctx[1] === '');
    			add_location(input, file$c, 256, 6, 6928);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			/*input_binding*/ ctx[41](input);
    			set_input_value(input, /*value*/ ctx[1]);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(listboxmenuicon, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[42]),
    					listen_dev(input, "input", /*input_handler*/ ctx[43], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler*/ ctx[35], false, false, false),
    					listen_dev(input, "keydown", stop_propagation(/*keydown_handler_1*/ ctx[44]), false, false, true),
    					listen_dev(input, "keyup", /*keyup_handler*/ ctx[36], false, false, false),
    					listen_dev(input, "focus", /*focus_handler*/ ctx[37], false, false, false),
    					listen_dev(input, "blur", /*blur_handler*/ ctx[38], false, false, false),
    					listen_dev(input, "blur", /*blur_handler_1*/ ctx[45], false, false, false),
    					listen_dev(input, "paste", /*paste_handler*/ ctx[39], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				{ tabindex: "0" },
    				{ autocomplete: "off" },
    				{ "aria-autocomplete": "list" },
    				(!current || dirty[0] & /*open*/ 4) && { "aria-expanded": /*open*/ ctx[2] },
    				(!current || dirty[0] & /*highlightedId*/ 33554432) && {
    					"aria-activedescendant": /*highlightedId*/ ctx[25]
    				},
    				(!current || dirty[0] & /*comboId*/ 67108864) && { "aria-labelledby": /*comboId*/ ctx[26] },
    				(!current || dirty[0] & /*disabled*/ 256) && { "aria-disabled": /*disabled*/ ctx[8] },
    				(!current || dirty[0] & /*open, menuId*/ 134217732 && input_aria_controls_value !== (input_aria_controls_value = /*open*/ ctx[2] ? /*menuId*/ ctx[27] : undefined)) && {
    					"aria-controls": input_aria_controls_value
    				},
    				(!current || dirty[0] & /*open, menuId*/ 134217732 && input_aria_owns_value !== (input_aria_owns_value = /*open*/ ctx[2] ? /*menuId*/ ctx[27] : undefined)) && { "aria-owns": input_aria_owns_value },
    				(!current || dirty[0] & /*disabled*/ 256) && { disabled: /*disabled*/ ctx[8] },
    				(!current || dirty[0] & /*placeholder*/ 1024) && { placeholder: /*placeholder*/ ctx[10] },
    				(!current || dirty[0] & /*id*/ 524288) && { id: /*id*/ ctx[19] },
    				(!current || dirty[0] & /*name*/ 1048576) && { name: /*name*/ ctx[20] },
    				dirty[0] & /*$$restProps*/ 1073741824 && /*$$restProps*/ ctx[30]
    			]));

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}

    			toggle_class(input, "bx--text-input", true);
    			toggle_class(input, "bx--text-input--light", /*light*/ ctx[16]);
    			toggle_class(input, "bx--text-input--empty", /*value*/ ctx[1] === '');

    			if (/*invalid*/ ctx[13]) {
    				if (if_block0) {
    					if (dirty[0] & /*invalid*/ 8192) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_5$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*invalid*/ ctx[13] && /*warn*/ ctx[14]) {
    				if (if_block1) {
    					if (dirty[0] & /*invalid, warn*/ 24576) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_4$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t2.parentNode, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*value*/ ctx[1]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*value*/ 2) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_3$3(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(t3.parentNode, t3);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			const listboxmenuicon_changes = {};
    			if (dirty[0] & /*translateWithId*/ 131072) listboxmenuicon_changes.translateWithId = /*translateWithId*/ ctx[17];
    			if (dirty[0] & /*open*/ 4) listboxmenuicon_changes.open = /*open*/ ctx[2];
    			listboxmenuicon.$set(listboxmenuicon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(listboxmenuicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(listboxmenuicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding*/ ctx[41](null);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(listboxmenuicon, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(244:4) <ListBoxField       role=\\\"button\\\"       aria-expanded=\\\"{open}\\\"       on:click=\\\"{async () => {         if (disabled) return;         open = true;         await tick();         ref.focus();       }}\\\"       id=\\\"{id}\\\"       disabled=\\\"{disabled}\\\"       translateWithId=\\\"{translateWithId}\\\"     >",
    		ctx
    	});

    	return block;
    }

    // (374:4) {#if open}
    function create_if_block_1$6(ctx) {
    	let listboxmenu;
    	let updating_ref;
    	let current;

    	function listboxmenu_ref_binding(value) {
    		/*listboxmenu_ref_binding*/ ctx[51](value);
    	}

    	let listboxmenu_props = {
    		"aria-label": /*ariaLabel*/ ctx[28],
    		id: /*id*/ ctx[19],
    		$$slots: { default: [create_default_slot_1$1] },
    		$$scope: { ctx }
    	};

    	if (/*listRef*/ ctx[4] !== void 0) {
    		listboxmenu_props.ref = /*listRef*/ ctx[4];
    	}

    	listboxmenu = new ListBoxMenu$1({ props: listboxmenu_props, $$inline: true });
    	binding_callbacks.push(() => bind(listboxmenu, 'ref', listboxmenu_ref_binding));
    	listboxmenu.$on("scroll", /*scroll_handler*/ ctx[52]);

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
    			if (dirty[0] & /*ariaLabel*/ 268435456) listboxmenu_changes["aria-label"] = /*ariaLabel*/ ctx[28];
    			if (dirty[0] & /*id*/ 524288) listboxmenu_changes.id = /*id*/ ctx[19];

    			if (dirty[0] & /*filteredItems, selectedId, highlightedIndex, open, value, itemToString, selectedItem*/ 29360167 | dirty[1] & /*$$scope*/ 4194304) {
    				listboxmenu_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_ref && dirty[0] & /*listRef*/ 16) {
    				updating_ref = true;
    				listboxmenu_changes.ref = /*listRef*/ ctx[4];
    				add_flush_callback(() => updating_ref = false);
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
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(374:4) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (404:44)
    function fallback_block$4(ctx) {
    	let t_value = /*itemToString*/ ctx[5](/*item*/ ctx[56]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*itemToString, filteredItems*/ 16777248 && t_value !== (t_value = /*itemToString*/ ctx[5](/*item*/ ctx[56]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$4.name,
    		type: "fallback",
    		source: "(404:44)                ",
    		ctx
    	});

    	return block;
    }

    // (407:12) {#if selectedItem && selectedItem.id === item.id}
    function create_if_block_2$4(ctx) {
    	let checkmark;
    	let current;

    	checkmark = new Checkmark$1({
    			props: {
    				class: "bx--list-box__menu-item__selected-icon"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(checkmark.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkmark, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkmark.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkmark.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkmark, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(407:12) {#if selectedItem && selectedItem.id === item.id}",
    		ctx
    	});

    	return block;
    }

    // (382:10) <ListBoxMenuItem             id="{item.id}"             active="{selectedId === item.id}"             highlighted="{highlightedIndex === i}"             disabled="{item.disabled}"             on:click="{(e) => {               if (item.disabled) {                 e.stopPropagation();                 return;               }               selectedId = item.id;               open = false;                if (filteredItems[i]) {                 value = itemToString(filteredItems[i]);               }             }}"             on:mouseenter="{() => {               if (item.disabled) return;               highlightedIndex = i;             }}"           >
    function create_default_slot_2$1(ctx) {
    	let t0;
    	let t1;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[34].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[53], get_default_slot_context$1);
    	const default_slot_or_fallback = default_slot || fallback_block$4(ctx);
    	let if_block = /*selectedItem*/ ctx[22] && /*selectedItem*/ ctx[22].id === /*item*/ ctx[56].id && create_if_block_2$4(ctx);

    	const block = {
    		c: function create() {
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*filteredItems*/ 16777216 | dirty[1] & /*$$scope*/ 4194304)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[53],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[53])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[53], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty[0] & /*itemToString, filteredItems*/ 16777248)) {
    					default_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}

    			if (/*selectedItem*/ ctx[22] && /*selectedItem*/ ctx[22].id === /*item*/ ctx[56].id) {
    				if (if_block) {
    					if (dirty[0] & /*selectedItem, filteredItems*/ 20971520) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
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
    			transition_in(default_slot_or_fallback, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(382:10) <ListBoxMenuItem             id=\\\"{item.id}\\\"             active=\\\"{selectedId === item.id}\\\"             highlighted=\\\"{highlightedIndex === i}\\\"             disabled=\\\"{item.disabled}\\\"             on:click=\\\"{(e) => {               if (item.disabled) {                 e.stopPropagation();                 return;               }               selectedId = item.id;               open = false;                if (filteredItems[i]) {                 value = itemToString(filteredItems[i]);               }             }}\\\"             on:mouseenter=\\\"{() => {               if (item.disabled) return;               highlightedIndex = i;             }}\\\"           >",
    		ctx
    	});

    	return block;
    }

    // (381:8) {#each filteredItems as item, i (item.id)}
    function create_each_block$2(key_1, ctx) {
    	let first;
    	let listboxmenuitem;
    	let current;

    	function click_handler_3(...args) {
    		return /*click_handler_3*/ ctx[49](/*item*/ ctx[56], /*i*/ ctx[58], ...args);
    	}

    	function mouseenter_handler() {
    		return /*mouseenter_handler*/ ctx[50](/*item*/ ctx[56], /*i*/ ctx[58]);
    	}

    	listboxmenuitem = new ListBoxMenuItem$1({
    			props: {
    				id: /*item*/ ctx[56].id,
    				active: /*selectedId*/ ctx[0] === /*item*/ ctx[56].id,
    				highlighted: /*highlightedIndex*/ ctx[23] === /*i*/ ctx[58],
    				disabled: /*item*/ ctx[56].disabled,
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	listboxmenuitem.$on("click", click_handler_3);
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
    			if (dirty[0] & /*filteredItems*/ 16777216) listboxmenuitem_changes.id = /*item*/ ctx[56].id;
    			if (dirty[0] & /*selectedId, filteredItems*/ 16777217) listboxmenuitem_changes.active = /*selectedId*/ ctx[0] === /*item*/ ctx[56].id;
    			if (dirty[0] & /*highlightedIndex, filteredItems*/ 25165824) listboxmenuitem_changes.highlighted = /*highlightedIndex*/ ctx[23] === /*i*/ ctx[58];
    			if (dirty[0] & /*filteredItems*/ 16777216) listboxmenuitem_changes.disabled = /*item*/ ctx[56].disabled;

    			if (dirty[0] & /*selectedItem, filteredItems, itemToString*/ 20971552 | dirty[1] & /*$$scope*/ 4194304) {
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
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(381:8) {#each filteredItems as item, i (item.id)}",
    		ctx
    	});

    	return block;
    }

    // (375:6) <ListBoxMenu         aria-label="{ariaLabel}"         id="{id}"         on:scroll         bind:ref="{listRef}"       >
    function create_default_slot_1$1(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*filteredItems*/ ctx[24];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[56].id;
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
    			if (dirty[0] & /*filteredItems, selectedId, highlightedIndex, open, value, itemToString, selectedItem*/ 29360167 | dirty[1] & /*$$scope*/ 4194304) {
    				each_value = /*filteredItems*/ ctx[24];
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
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(375:6) <ListBoxMenu         aria-label=\\\"{ariaLabel}\\\"         id=\\\"{id}\\\"         on:scroll         bind:ref=\\\"{listRef}\\\"       >",
    		ctx
    	});

    	return block;
    }

    // (230:2) <ListBox     class="bx--combo-box {direction === 'top' &&       'bx--list-box--up'} {!invalid && warn && 'bx--combo-box--warning'}"     id="{comboId}"     aria-label="{ariaLabel}"     disabled="{disabled}"     invalid="{invalid}"     invalidText="{invalidText}"     open="{open}"     light="{light}"     size="{size}"     warn="{warn}"     warnText="{warnText}"   >
    function create_default_slot$2(ctx) {
    	let listboxfield;
    	let t;
    	let if_block_anchor;
    	let current;

    	listboxfield = new ListBoxField$1({
    			props: {
    				role: "button",
    				"aria-expanded": /*open*/ ctx[2],
    				id: /*id*/ ctx[19],
    				disabled: /*disabled*/ ctx[8],
    				translateWithId: /*translateWithId*/ ctx[17],
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	listboxfield.$on("click", /*click_handler_2*/ ctx[48]);
    	let if_block = /*open*/ ctx[2] && create_if_block_1$6(ctx);

    	const block = {
    		c: function create() {
    			create_component(listboxfield.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(listboxfield, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const listboxfield_changes = {};
    			if (dirty[0] & /*open*/ 4) listboxfield_changes["aria-expanded"] = /*open*/ ctx[2];
    			if (dirty[0] & /*id*/ 524288) listboxfield_changes.id = /*id*/ ctx[19];
    			if (dirty[0] & /*disabled*/ 256) listboxfield_changes.disabled = /*disabled*/ ctx[8];
    			if (dirty[0] & /*translateWithId*/ 131072) listboxfield_changes.translateWithId = /*translateWithId*/ ctx[17];

    			if (dirty[0] & /*translateWithId, open, disabled, translateWithIdSelection, value, invalid, warn, highlightedId, comboId, menuId, placeholder, id, name, $$restProps, ref, light, highlightedIndex, filteredItems, selectedId, itemToString, selectedItem*/ 1340040495 | dirty[1] & /*$$scope*/ 4194304) {
    				listboxfield_changes.$$scope = { dirty, ctx };
    			}

    			listboxfield.$set(listboxfield_changes);

    			if (/*open*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*open*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$6(ctx);
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
    			transition_in(listboxfield.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(listboxfield.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(listboxfield, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(230:2) <ListBox     class=\\\"bx--combo-box {direction === 'top' &&       'bx--list-box--up'} {!invalid && warn && 'bx--combo-box--warning'}\\\"     id=\\\"{comboId}\\\"     aria-label=\\\"{ariaLabel}\\\"     disabled=\\\"{disabled}\\\"     invalid=\\\"{invalid}\\\"     invalidText=\\\"{invalidText}\\\"     open=\\\"{open}\\\"     light=\\\"{light}\\\"     size=\\\"{size}\\\"     warn=\\\"{warn}\\\"     warnText=\\\"{warnText}\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (415:2) {#if !invalid && helperText && !warn}
    function create_if_block$9(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*helperText*/ ctx[11]);
    			toggle_class(div, "bx--form__helper-text", true);
    			toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[8]);
    			add_location(div, file$c, 415, 4, 11908);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*helperText*/ 2048) set_data_dev(t, /*helperText*/ ctx[11]);

    			if (dirty[0] & /*disabled*/ 256) {
    				toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[8]);
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
    		source: "(415:2) {#if !invalid && helperText && !warn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div;
    	let t0;
    	let listbox;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*titleText*/ ctx[9] && create_if_block_6$1(ctx);

    	listbox = new ListBox$1({
    			props: {
    				class: "bx--combo-box " + (/*direction*/ ctx[6] === 'top' && 'bx--list-box--up') + " " + (!/*invalid*/ ctx[13] && /*warn*/ ctx[14] && 'bx--combo-box--warning'),
    				id: /*comboId*/ ctx[26],
    				"aria-label": /*ariaLabel*/ ctx[28],
    				disabled: /*disabled*/ ctx[8],
    				invalid: /*invalid*/ ctx[13],
    				invalidText: /*invalidText*/ ctx[12],
    				open: /*open*/ ctx[2],
    				light: /*light*/ ctx[16],
    				size: /*size*/ ctx[7],
    				warn: /*warn*/ ctx[14],
    				warnText: /*warnText*/ ctx[15],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block1 = !/*invalid*/ ctx[13] && /*helperText*/ ctx[11] && !/*warn*/ ctx[14] && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			create_component(listbox.$$.fragment);
    			t1 = space();
    			if (if_block1) if_block1.c();
    			toggle_class(div, "bx--list-box__wrapper", true);
    			add_location(div, file$c, 219, 0, 6050);
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
    				dispose = listen_dev(window, "click", /*click_handler*/ ctx[40], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*titleText*/ ctx[9]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_6$1(ctx);
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			const listbox_changes = {};
    			if (dirty[0] & /*direction, invalid, warn*/ 24640) listbox_changes.class = "bx--combo-box " + (/*direction*/ ctx[6] === 'top' && 'bx--list-box--up') + " " + (!/*invalid*/ ctx[13] && /*warn*/ ctx[14] && 'bx--combo-box--warning');
    			if (dirty[0] & /*comboId*/ 67108864) listbox_changes.id = /*comboId*/ ctx[26];
    			if (dirty[0] & /*ariaLabel*/ 268435456) listbox_changes["aria-label"] = /*ariaLabel*/ ctx[28];
    			if (dirty[0] & /*disabled*/ 256) listbox_changes.disabled = /*disabled*/ ctx[8];
    			if (dirty[0] & /*invalid*/ 8192) listbox_changes.invalid = /*invalid*/ ctx[13];
    			if (dirty[0] & /*invalidText*/ 4096) listbox_changes.invalidText = /*invalidText*/ ctx[12];
    			if (dirty[0] & /*open*/ 4) listbox_changes.open = /*open*/ ctx[2];
    			if (dirty[0] & /*light*/ 65536) listbox_changes.light = /*light*/ ctx[16];
    			if (dirty[0] & /*size*/ 128) listbox_changes.size = /*size*/ ctx[7];
    			if (dirty[0] & /*warn*/ 16384) listbox_changes.warn = /*warn*/ ctx[14];
    			if (dirty[0] & /*warnText*/ 32768) listbox_changes.warnText = /*warnText*/ ctx[15];

    			if (dirty[0] & /*ariaLabel, id, listRef, filteredItems, selectedId, highlightedIndex, open, value, itemToString, selectedItem, disabled, translateWithId, ref, translateWithIdSelection, invalid, warn, highlightedId, comboId, menuId, placeholder, name, $$restProps, light*/ 1608475967 | dirty[1] & /*$$scope*/ 4194304) {
    				listbox_changes.$$scope = { dirty, ctx };
    			}

    			listbox.$set(listbox_changes);

    			if (!/*invalid*/ ctx[13] && /*helperText*/ ctx[11] && !/*warn*/ ctx[14]) {
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
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let menuId;
    	let comboId;
    	let highlightedId;
    	let filteredItems;

    	const omit_props_names = [
    		"items","itemToString","selectedId","value","direction","size","disabled","titleText","placeholder","helperText","invalidText","invalid","warn","warnText","light","open","shouldFilterItem","translateWithId","translateWithIdSelection","id","name","ref","listRef","clear"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ComboBox', slots, ['default']);
    	let { items = [] } = $$props;
    	let { itemToString = item => item.text || item.id } = $$props;
    	let { selectedId = undefined } = $$props;
    	let { value = "" } = $$props;
    	let { direction = "bottom" } = $$props;
    	let { size = undefined } = $$props;
    	let { disabled = false } = $$props;
    	let { titleText = "" } = $$props;
    	let { placeholder = "" } = $$props;
    	let { helperText = "" } = $$props;
    	let { invalidText = "" } = $$props;
    	let { invalid = false } = $$props;
    	let { warn = false } = $$props;
    	let { warnText = "" } = $$props;
    	let { light = false } = $$props;
    	let { open = false } = $$props;
    	let { shouldFilterItem = () => true } = $$props;
    	let { translateWithId = undefined } = $$props;
    	let { translateWithIdSelection = undefined } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { name = undefined } = $$props;
    	let { ref = null } = $$props;
    	let { listRef = null } = $$props;
    	const dispatch = createEventDispatcher();
    	let selectedItem = undefined;
    	let prevSelectedId = null;
    	let highlightedIndex = -1;

    	function change(dir) {
    		let index = highlightedIndex + dir;
    		let _items = !filteredItems?.length ? items : filteredItems;
    		if (_items.length === 0) return;

    		if (index < 0) {
    			index = _items.length - 1;
    		} else if (index >= _items.length) {
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

    		$$invalidate(23, highlightedIndex = index);
    	}

    	function clear(options = {}) {
    		$$invalidate(33, prevSelectedId = null);
    		$$invalidate(23, highlightedIndex = -1);
    		$$invalidate(25, highlightedId = undefined);
    		$$invalidate(0, selectedId = undefined);
    		$$invalidate(22, selectedItem = undefined);
    		$$invalidate(2, open = false);
    		$$invalidate(1, value = "");
    		if (options?.focus !== false) ref?.focus();
    	}

    	afterUpdate(() => {
    		if (open) {
    			ref.focus();
    			$$invalidate(24, filteredItems = items.filter(item => shouldFilterItem(item, value)));
    		} else {
    			$$invalidate(23, highlightedIndex = -1);
    			$$invalidate(24, filteredItems = []);

    			if (!selectedItem) {
    				$$invalidate(0, selectedId = undefined);
    				$$invalidate(1, value = "");
    				$$invalidate(23, highlightedIndex = -1);
    				$$invalidate(25, highlightedId = undefined);
    			} else {
    				// programmatically set value
    				$$invalidate(1, value = itemToString(selectedItem));
    			}
    		}
    	});

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

    	const click_handler = ({ target }) => {
    		if (open && ref && !ref.contains(target)) {
    			$$invalidate(2, open = false);
    		}
    	};

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(3, ref);
    		});
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	const input_handler = ({ target }) => {
    		if (!open && target.value.length > 0) {
    			$$invalidate(2, open = true);
    		}

    		if (!value.length) {
    			clear();
    			$$invalidate(2, open = true);
    		}
    	};

    	const keydown_handler_1 = e => {
    		const { key } = e;

    		if (['Enter', 'ArrowDown', 'ArrowUp'].includes(key)) {
    			e.preventDefault();
    		}

    		if (key === 'Enter') {
    			$$invalidate(2, open = !open);

    			if (highlightedIndex > -1 && filteredItems[highlightedIndex]?.id !== selectedId) {
    				$$invalidate(2, open = false);

    				if (filteredItems[highlightedIndex]) {
    					$$invalidate(1, value = itemToString(filteredItems[highlightedIndex]));
    					$$invalidate(22, selectedItem = filteredItems[highlightedIndex]);
    					$$invalidate(0, selectedId = filteredItems[highlightedIndex].id);
    				}
    			} else {
    				// searching typed value in text list with lowercase
    				const matchedItem = filteredItems.find(e => e.text.toLowerCase() === value?.toLowerCase() && !e.disabled) ?? filteredItems.find(e => !e.disabled);

    				if (matchedItem) {
    					// typed value has matched or fallback to first enabled item
    					$$invalidate(2, open = false);

    					$$invalidate(22, selectedItem = matchedItem);
    					$$invalidate(1, value = itemToString(selectedItem));
    					$$invalidate(0, selectedId = selectedItem.id);
    				}
    			}

    			$$invalidate(23, highlightedIndex = -1);
    		} else if (key === 'Tab') {
    			$$invalidate(2, open = false);
    		} else if (key === 'ArrowDown') {
    			change(1);
    		} else if (key === 'ArrowUp') {
    			change(-1);
    		} else if (key === 'Escape') {
    			$$invalidate(2, open = false);
    		}
    	};

    	const blur_handler_1 = ({ relatedTarget }) => {
    		if (!open || !relatedTarget) return;

    		if (relatedTarget && !['INPUT', 'SELECT', 'TEXTAREA'].includes(relatedTarget.tagName) && relatedTarget.getAttribute('role') !== 'button' && relatedTarget.getAttribute('role') !== 'searchbox') {
    			ref.focus();
    		}
    	};

    	function clear_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler_1 = e => {
    		if (disabled) return;
    		e.stopPropagation();
    		$$invalidate(2, open = !open);
    	};

    	const click_handler_2 = async () => {
    		if (disabled) return;
    		$$invalidate(2, open = true);
    		await tick();
    		ref.focus();
    	};

    	const click_handler_3 = (item, i, e) => {
    		if (item.disabled) {
    			e.stopPropagation();
    			return;
    		}

    		$$invalidate(0, selectedId = item.id);
    		$$invalidate(2, open = false);

    		if (filteredItems[i]) {
    			$$invalidate(1, value = itemToString(filteredItems[i]));
    		}
    	};

    	const mouseenter_handler = (item, i) => {
    		if (item.disabled) return;
    		$$invalidate(23, highlightedIndex = i);
    	};

    	function listboxmenu_ref_binding(value) {
    		listRef = value;
    		$$invalidate(4, listRef);
    	}

    	function scroll_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(55, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(30, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('items' in $$new_props) $$invalidate(31, items = $$new_props.items);
    		if ('itemToString' in $$new_props) $$invalidate(5, itemToString = $$new_props.itemToString);
    		if ('selectedId' in $$new_props) $$invalidate(0, selectedId = $$new_props.selectedId);
    		if ('value' in $$new_props) $$invalidate(1, value = $$new_props.value);
    		if ('direction' in $$new_props) $$invalidate(6, direction = $$new_props.direction);
    		if ('size' in $$new_props) $$invalidate(7, size = $$new_props.size);
    		if ('disabled' in $$new_props) $$invalidate(8, disabled = $$new_props.disabled);
    		if ('titleText' in $$new_props) $$invalidate(9, titleText = $$new_props.titleText);
    		if ('placeholder' in $$new_props) $$invalidate(10, placeholder = $$new_props.placeholder);
    		if ('helperText' in $$new_props) $$invalidate(11, helperText = $$new_props.helperText);
    		if ('invalidText' in $$new_props) $$invalidate(12, invalidText = $$new_props.invalidText);
    		if ('invalid' in $$new_props) $$invalidate(13, invalid = $$new_props.invalid);
    		if ('warn' in $$new_props) $$invalidate(14, warn = $$new_props.warn);
    		if ('warnText' in $$new_props) $$invalidate(15, warnText = $$new_props.warnText);
    		if ('light' in $$new_props) $$invalidate(16, light = $$new_props.light);
    		if ('open' in $$new_props) $$invalidate(2, open = $$new_props.open);
    		if ('shouldFilterItem' in $$new_props) $$invalidate(32, shouldFilterItem = $$new_props.shouldFilterItem);
    		if ('translateWithId' in $$new_props) $$invalidate(17, translateWithId = $$new_props.translateWithId);
    		if ('translateWithIdSelection' in $$new_props) $$invalidate(18, translateWithIdSelection = $$new_props.translateWithIdSelection);
    		if ('id' in $$new_props) $$invalidate(19, id = $$new_props.id);
    		if ('name' in $$new_props) $$invalidate(20, name = $$new_props.name);
    		if ('ref' in $$new_props) $$invalidate(3, ref = $$new_props.ref);
    		if ('listRef' in $$new_props) $$invalidate(4, listRef = $$new_props.listRef);
    		if ('$$scope' in $$new_props) $$invalidate(53, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		items,
    		itemToString,
    		selectedId,
    		value,
    		direction,
    		size,
    		disabled,
    		titleText,
    		placeholder,
    		helperText,
    		invalidText,
    		invalid,
    		warn,
    		warnText,
    		light,
    		open,
    		shouldFilterItem,
    		translateWithId,
    		translateWithIdSelection,
    		id,
    		name,
    		ref,
    		listRef,
    		createEventDispatcher,
    		afterUpdate,
    		tick,
    		Checkmark: Checkmark$1,
    		WarningFilled: WarningFilled$1,
    		WarningAltFilled: WarningAltFilled$1,
    		ListBox: ListBox$1,
    		ListBoxField: ListBoxField$1,
    		ListBoxMenu: ListBoxMenu$1,
    		ListBoxMenuIcon: ListBoxMenuIcon$1,
    		ListBoxMenuItem: ListBoxMenuItem$1,
    		ListBoxSelection: ListBoxSelection$1,
    		dispatch,
    		selectedItem,
    		prevSelectedId,
    		highlightedIndex,
    		change,
    		clear,
    		filteredItems,
    		highlightedId,
    		comboId,
    		menuId,
    		ariaLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(55, $$props = assign(assign({}, $$props), $$new_props));
    		if ('items' in $$props) $$invalidate(31, items = $$new_props.items);
    		if ('itemToString' in $$props) $$invalidate(5, itemToString = $$new_props.itemToString);
    		if ('selectedId' in $$props) $$invalidate(0, selectedId = $$new_props.selectedId);
    		if ('value' in $$props) $$invalidate(1, value = $$new_props.value);
    		if ('direction' in $$props) $$invalidate(6, direction = $$new_props.direction);
    		if ('size' in $$props) $$invalidate(7, size = $$new_props.size);
    		if ('disabled' in $$props) $$invalidate(8, disabled = $$new_props.disabled);
    		if ('titleText' in $$props) $$invalidate(9, titleText = $$new_props.titleText);
    		if ('placeholder' in $$props) $$invalidate(10, placeholder = $$new_props.placeholder);
    		if ('helperText' in $$props) $$invalidate(11, helperText = $$new_props.helperText);
    		if ('invalidText' in $$props) $$invalidate(12, invalidText = $$new_props.invalidText);
    		if ('invalid' in $$props) $$invalidate(13, invalid = $$new_props.invalid);
    		if ('warn' in $$props) $$invalidate(14, warn = $$new_props.warn);
    		if ('warnText' in $$props) $$invalidate(15, warnText = $$new_props.warnText);
    		if ('light' in $$props) $$invalidate(16, light = $$new_props.light);
    		if ('open' in $$props) $$invalidate(2, open = $$new_props.open);
    		if ('shouldFilterItem' in $$props) $$invalidate(32, shouldFilterItem = $$new_props.shouldFilterItem);
    		if ('translateWithId' in $$props) $$invalidate(17, translateWithId = $$new_props.translateWithId);
    		if ('translateWithIdSelection' in $$props) $$invalidate(18, translateWithIdSelection = $$new_props.translateWithIdSelection);
    		if ('id' in $$props) $$invalidate(19, id = $$new_props.id);
    		if ('name' in $$props) $$invalidate(20, name = $$new_props.name);
    		if ('ref' in $$props) $$invalidate(3, ref = $$new_props.ref);
    		if ('listRef' in $$props) $$invalidate(4, listRef = $$new_props.listRef);
    		if ('selectedItem' in $$props) $$invalidate(22, selectedItem = $$new_props.selectedItem);
    		if ('prevSelectedId' in $$props) $$invalidate(33, prevSelectedId = $$new_props.prevSelectedId);
    		if ('highlightedIndex' in $$props) $$invalidate(23, highlightedIndex = $$new_props.highlightedIndex);
    		if ('filteredItems' in $$props) $$invalidate(24, filteredItems = $$new_props.filteredItems);
    		if ('highlightedId' in $$props) $$invalidate(25, highlightedId = $$new_props.highlightedId);
    		if ('comboId' in $$props) $$invalidate(26, comboId = $$new_props.comboId);
    		if ('menuId' in $$props) $$invalidate(27, menuId = $$new_props.menuId);
    		if ('ariaLabel' in $$props) $$invalidate(28, ariaLabel = $$new_props.ariaLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*value*/ 2 | $$self.$$.dirty[1] & /*items, shouldFilterItem*/ 3) {
    			$$invalidate(24, filteredItems = items.filter(item => shouldFilterItem(item, value)));
    		}

    		if ($$self.$$.dirty[0] & /*selectedId, filteredItems, open, selectedItem*/ 20971525 | $$self.$$.dirty[1] & /*prevSelectedId, items*/ 5) {
    			if (selectedId !== undefined) {
    				if (prevSelectedId !== selectedId) {
    					$$invalidate(33, prevSelectedId = selectedId);

    					if (filteredItems?.length === 1 && open) {
    						$$invalidate(0, selectedId = filteredItems[0].id);
    						$$invalidate(22, selectedItem = filteredItems[0]);
    						$$invalidate(23, highlightedIndex = -1);
    						$$invalidate(25, highlightedId = undefined);
    					} else {
    						$$invalidate(22, selectedItem = items.find(item => item.id === selectedId));
    					}

    					dispatch("select", { selectedId, selectedItem });
    				}
    			} else {
    				$$invalidate(33, prevSelectedId = selectedId);
    				$$invalidate(22, selectedItem = undefined);
    			}
    		}

    		$$invalidate(28, ariaLabel = $$props["aria-label"] || "Choose an item");

    		if ($$self.$$.dirty[0] & /*id*/ 524288) {
    			$$invalidate(27, menuId = `menu-${id}`);
    		}

    		if ($$self.$$.dirty[0] & /*id*/ 524288) {
    			$$invalidate(26, comboId = `combo-${id}`);
    		}

    		if ($$self.$$.dirty[0] & /*highlightedIndex*/ 8388608 | $$self.$$.dirty[1] & /*items*/ 1) {
    			$$invalidate(25, highlightedId = items[highlightedIndex] ? items[highlightedIndex].id : 0);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		selectedId,
    		value,
    		open,
    		ref,
    		listRef,
    		itemToString,
    		direction,
    		size,
    		disabled,
    		titleText,
    		placeholder,
    		helperText,
    		invalidText,
    		invalid,
    		warn,
    		warnText,
    		light,
    		translateWithId,
    		translateWithIdSelection,
    		id,
    		name,
    		clear,
    		selectedItem,
    		highlightedIndex,
    		filteredItems,
    		highlightedId,
    		comboId,
    		menuId,
    		ariaLabel,
    		change,
    		$$restProps,
    		items,
    		shouldFilterItem,
    		prevSelectedId,
    		slots,
    		keydown_handler,
    		keyup_handler,
    		focus_handler,
    		blur_handler,
    		paste_handler,
    		click_handler,
    		input_binding,
    		input_input_handler,
    		input_handler,
    		keydown_handler_1,
    		blur_handler_1,
    		clear_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		mouseenter_handler,
    		listboxmenu_ref_binding,
    		scroll_handler,
    		$$scope
    	];
    }

    class ComboBox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$c,
    			create_fragment$c,
    			safe_not_equal,
    			{
    				items: 31,
    				itemToString: 5,
    				selectedId: 0,
    				value: 1,
    				direction: 6,
    				size: 7,
    				disabled: 8,
    				titleText: 9,
    				placeholder: 10,
    				helperText: 11,
    				invalidText: 12,
    				invalid: 13,
    				warn: 14,
    				warnText: 15,
    				light: 16,
    				open: 2,
    				shouldFilterItem: 32,
    				translateWithId: 17,
    				translateWithIdSelection: 18,
    				id: 19,
    				name: 20,
    				ref: 3,
    				listRef: 4,
    				clear: 21
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ComboBox",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get items() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemToString() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemToString(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedId() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedId(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get direction() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleText() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleText(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperText() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperText(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalidText() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalidText(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warn() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warn(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warnText() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warnText(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shouldFilterItem() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shouldFilterItem(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translateWithId() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set translateWithId(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translateWithIdSelection() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set translateWithIdSelection(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listRef() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listRef(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clear() {
    		return this.$$.ctx[21];
    	}

    	set clear(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ComboBox$1 = ComboBox;

    /* node_modules/carbon-components-svelte/src/icons/CheckmarkFilled.svelte generated by Svelte v3.55.1 */

    const file$b = "node_modules/carbon-components-svelte/src/icons/CheckmarkFilled.svelte";

    // (24:2) {#if title}
    function create_if_block$8(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$b, 23, 13, 549);
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

    function create_fragment$b(ctx) {
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
    			add_location(path0, file$b, 24, 2, 579);
    			attr_dev(path1, "fill", "none");
    			attr_dev(path1, "d", "M14 21.591L9 16.591 10.591 15 14 18.409 21.41 11 23.005 12.585 14 21.591z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			add_location(path1, file$b, 26, 10, 707);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$b, 13, 0, 338);
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
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CheckmarkFilled",
    			options,
    			id: create_fragment$b.name
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

    /* node_modules/carbon-components-svelte/src/Loading/Loading.svelte generated by Svelte v3.55.1 */

    const file$a = "node_modules/carbon-components-svelte/src/Loading/Loading.svelte";

    // (53:0) {:else}
    function create_else_block(ctx) {
    	let div;
    	let label;
    	let t0;
    	let t1;
    	let svg;
    	let title;
    	let t2;
    	let circle;
    	let div_aria_live_value;
    	let if_block = /*small*/ ctx[0] && create_if_block_2$3(ctx);

    	let div_levels = [
    		{ "aria-atomic": "true" },
    		{ "aria-labelledby": /*id*/ ctx[4] },
    		{
    			"aria-live": div_aria_live_value = /*active*/ ctx[1] ? 'assertive' : 'off'
    		},
    		/*$$restProps*/ ctx[6]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			t0 = text(/*description*/ ctx[3]);
    			t1 = space();
    			svg = svg_element("svg");
    			title = svg_element("title");
    			t2 = text(/*description*/ ctx[3]);
    			if (if_block) if_block.c();
    			circle = svg_element("circle");
    			attr_dev(label, "id", /*id*/ ctx[4]);
    			toggle_class(label, "bx--visually-hidden", true);
    			add_location(label, file$a, 63, 4, 1781);
    			add_location(title, file$a, 65, 6, 1925);
    			attr_dev(circle, "cx", "50%");
    			attr_dev(circle, "cy", "50%");
    			attr_dev(circle, "r", /*spinnerRadius*/ ctx[5]);
    			toggle_class(circle, "bx--loading__stroke", true);
    			add_location(circle, file$a, 73, 6, 2133);
    			attr_dev(svg, "viewBox", "0 0 100 100");
    			toggle_class(svg, "bx--loading__svg", true);
    			add_location(svg, file$a, 64, 4, 1859);
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--loading", true);
    			toggle_class(div, "bx--loading--small", /*small*/ ctx[0]);
    			toggle_class(div, "bx--loading--stop", !/*active*/ ctx[1]);
    			add_location(div, file$a, 53, 2, 1479);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(label, t0);
    			append_dev(div, t1);
    			append_dev(div, svg);
    			append_dev(svg, title);
    			append_dev(title, t2);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, circle);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*description*/ 8) set_data_dev(t0, /*description*/ ctx[3]);

    			if (dirty & /*id*/ 16) {
    				attr_dev(label, "id", /*id*/ ctx[4]);
    			}

    			if (dirty & /*description*/ 8) set_data_dev(t2, /*description*/ ctx[3]);

    			if (/*small*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$3(ctx);
    					if_block.c();
    					if_block.m(svg, circle);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*spinnerRadius*/ 32) {
    				attr_dev(circle, "r", /*spinnerRadius*/ ctx[5]);
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				{ "aria-atomic": "true" },
    				dirty & /*id*/ 16 && { "aria-labelledby": /*id*/ ctx[4] },
    				dirty & /*active*/ 2 && div_aria_live_value !== (div_aria_live_value = /*active*/ ctx[1] ? 'assertive' : 'off') && { "aria-live": div_aria_live_value },
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));

    			toggle_class(div, "bx--loading", true);
    			toggle_class(div, "bx--loading--small", /*small*/ ctx[0]);
    			toggle_class(div, "bx--loading--stop", !/*active*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(53:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (20:0) {#if withOverlay}
    function create_if_block$7(ctx) {
    	let div1;
    	let div0;
    	let label;
    	let t0;
    	let t1;
    	let svg;
    	let title;
    	let t2;
    	let circle;
    	let div0_aria_live_value;
    	let if_block = /*small*/ ctx[0] && create_if_block_1$5(ctx);
    	let div1_levels = [/*$$restProps*/ ctx[6]];
    	let div1_data = {};

    	for (let i = 0; i < div1_levels.length; i += 1) {
    		div1_data = assign(div1_data, div1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			label = element("label");
    			t0 = text(/*description*/ ctx[3]);
    			t1 = space();
    			svg = svg_element("svg");
    			title = svg_element("title");
    			t2 = text(/*description*/ ctx[3]);
    			if (if_block) if_block.c();
    			circle = svg_element("circle");
    			attr_dev(label, "id", /*id*/ ctx[4]);
    			toggle_class(label, "bx--visually-hidden", true);
    			add_location(label, file$a, 34, 6, 933);
    			add_location(title, file$a, 36, 8, 1081);
    			attr_dev(circle, "cx", "50%");
    			attr_dev(circle, "cy", "50%");
    			attr_dev(circle, "r", /*spinnerRadius*/ ctx[5]);
    			toggle_class(circle, "bx--loading__stroke", true);
    			add_location(circle, file$a, 44, 8, 1305);
    			attr_dev(svg, "viewBox", "0 0 100 100");
    			toggle_class(svg, "bx--loading__svg", true);
    			add_location(svg, file$a, 35, 6, 1013);
    			attr_dev(div0, "aria-atomic", "true");
    			attr_dev(div0, "aria-labelledby", /*id*/ ctx[4]);
    			attr_dev(div0, "aria-live", div0_aria_live_value = /*active*/ ctx[1] ? 'assertive' : 'off');
    			toggle_class(div0, "bx--loading", true);
    			toggle_class(div0, "bx--loading--small", /*small*/ ctx[0]);
    			toggle_class(div0, "bx--loading--stop", !/*active*/ ctx[1]);
    			add_location(div0, file$a, 25, 4, 634);
    			set_attributes(div1, div1_data);
    			toggle_class(div1, "bx--loading-overlay", true);
    			toggle_class(div1, "bx--loading-overlay--stop", !/*active*/ ctx[1]);
    			add_location(div1, file$a, 20, 2, 513);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, label);
    			append_dev(label, t0);
    			append_dev(div0, t1);
    			append_dev(div0, svg);
    			append_dev(svg, title);
    			append_dev(title, t2);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, circle);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*description*/ 8) set_data_dev(t0, /*description*/ ctx[3]);

    			if (dirty & /*id*/ 16) {
    				attr_dev(label, "id", /*id*/ ctx[4]);
    			}

    			if (dirty & /*description*/ 8) set_data_dev(t2, /*description*/ ctx[3]);

    			if (/*small*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$5(ctx);
    					if_block.c();
    					if_block.m(svg, circle);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*spinnerRadius*/ 32) {
    				attr_dev(circle, "r", /*spinnerRadius*/ ctx[5]);
    			}

    			if (dirty & /*id*/ 16) {
    				attr_dev(div0, "aria-labelledby", /*id*/ ctx[4]);
    			}

    			if (dirty & /*active*/ 2 && div0_aria_live_value !== (div0_aria_live_value = /*active*/ ctx[1] ? 'assertive' : 'off')) {
    				attr_dev(div0, "aria-live", div0_aria_live_value);
    			}

    			if (dirty & /*small*/ 1) {
    				toggle_class(div0, "bx--loading--small", /*small*/ ctx[0]);
    			}

    			if (dirty & /*active*/ 2) {
    				toggle_class(div0, "bx--loading--stop", !/*active*/ ctx[1]);
    			}

    			set_attributes(div1, div1_data = get_spread_update(div1_levels, [dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]]));
    			toggle_class(div1, "bx--loading-overlay", true);
    			toggle_class(div1, "bx--loading-overlay--stop", !/*active*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(20:0) {#if withOverlay}",
    		ctx
    	});

    	return block;
    }

    // (67:6) {#if small}
    function create_if_block_2$3(ctx) {
    	let circle;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "cx", "50%");
    			attr_dev(circle, "cy", "50%");
    			attr_dev(circle, "r", /*spinnerRadius*/ ctx[5]);
    			toggle_class(circle, "bx--loading__background", true);
    			add_location(circle, file$a, 67, 8, 1980);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*spinnerRadius*/ 32) {
    				attr_dev(circle, "r", /*spinnerRadius*/ ctx[5]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(67:6) {#if small}",
    		ctx
    	});

    	return block;
    }

    // (38:8) {#if small}
    function create_if_block_1$5(ctx) {
    	let circle;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "cx", "50%");
    			attr_dev(circle, "cy", "50%");
    			attr_dev(circle, "r", /*spinnerRadius*/ ctx[5]);
    			toggle_class(circle, "bx--loading__background", true);
    			add_location(circle, file$a, 38, 10, 1140);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*spinnerRadius*/ 32) {
    				attr_dev(circle, "r", /*spinnerRadius*/ ctx[5]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(38:8) {#if small}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*withOverlay*/ ctx[2]) return create_if_block$7;
    		return create_else_block;
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
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let spinnerRadius;
    	const omit_props_names = ["small","active","withOverlay","description","id"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Loading', slots, []);
    	let { small = false } = $$props;
    	let { active = true } = $$props;
    	let { withOverlay = true } = $$props;
    	let { description = "Active loading indicator" } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('small' in $$new_props) $$invalidate(0, small = $$new_props.small);
    		if ('active' in $$new_props) $$invalidate(1, active = $$new_props.active);
    		if ('withOverlay' in $$new_props) $$invalidate(2, withOverlay = $$new_props.withOverlay);
    		if ('description' in $$new_props) $$invalidate(3, description = $$new_props.description);
    		if ('id' in $$new_props) $$invalidate(4, id = $$new_props.id);
    	};

    	$$self.$capture_state = () => ({
    		small,
    		active,
    		withOverlay,
    		description,
    		id,
    		spinnerRadius
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('small' in $$props) $$invalidate(0, small = $$new_props.small);
    		if ('active' in $$props) $$invalidate(1, active = $$new_props.active);
    		if ('withOverlay' in $$props) $$invalidate(2, withOverlay = $$new_props.withOverlay);
    		if ('description' in $$props) $$invalidate(3, description = $$new_props.description);
    		if ('id' in $$props) $$invalidate(4, id = $$new_props.id);
    		if ('spinnerRadius' in $$props) $$invalidate(5, spinnerRadius = $$new_props.spinnerRadius);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*small*/ 1) {
    			$$invalidate(5, spinnerRadius = small ? "42" : "44");
    		}
    	};

    	return [small, active, withOverlay, description, id, spinnerRadius, $$restProps];
    }

    class Loading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			small: 0,
    			active: 1,
    			withOverlay: 2,
    			description: 3,
    			id: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loading",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get small() {
    		throw new Error("<Loading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set small(value) {
    		throw new Error("<Loading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Loading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Loading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get withOverlay() {
    		throw new Error("<Loading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set withOverlay(value) {
    		throw new Error("<Loading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<Loading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<Loading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Loading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Loading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Loading$1 = Loading;

    /* node_modules/carbon-components-svelte/src/FileUploader/Filename.svelte generated by Svelte v3.55.1 */
    const file$9 = "node_modules/carbon-components-svelte/src/FileUploader/Filename.svelte";

    // (24:0) {#if status === "uploading"}
    function create_if_block_3$2(ctx) {
    	let loading;
    	let current;

    	const loading_spread_levels = [
    		{ description: /*iconDescription*/ ctx[1] },
    		/*$$restProps*/ ctx[3],
    		{ small: true },
    		{ withOverlay: false }
    	];

    	let loading_props = {};

    	for (let i = 0; i < loading_spread_levels.length; i += 1) {
    		loading_props = assign(loading_props, loading_spread_levels[i]);
    	}

    	loading = new Loading$1({ props: loading_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const loading_changes = (dirty & /*iconDescription, $$restProps*/ 10)
    			? get_spread_update(loading_spread_levels, [
    					dirty & /*iconDescription*/ 2 && { description: /*iconDescription*/ ctx[1] },
    					dirty & /*$$restProps*/ 8 && get_spread_object(/*$$restProps*/ ctx[3]),
    					loading_spread_levels[2],
    					loading_spread_levels[3]
    				])
    			: {};

    			loading.$set(loading_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(24:0) {#if status === \\\"uploading\\\"}",
    		ctx
    	});

    	return block;
    }

    // (33:0) {#if status === "edit"}
    function create_if_block_1$4(ctx) {
    	let t;
    	let button;
    	let close;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*invalid*/ ctx[2] && create_if_block_2$2(ctx);
    	close = new Close$1({ $$inline: true });

    	let button_levels = [
    		{ "aria-label": /*iconDescription*/ ctx[1] },
    		{ type: "button" },
    		{ tabindex: "0" },
    		/*$$restProps*/ ctx[3]
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			button = element("button");
    			create_component(close.$$.fragment);
    			set_attributes(button, button_data);
    			toggle_class(button, "bx--file-close", true);
    			add_location(button, file$9, 36, 2, 840);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, button, anchor);
    			mount_component(close, button, null);
    			if (button.autofocus) button.focus();
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(button, "keydown", /*keydown_handler*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*invalid*/ ctx[2]) {
    				if (if_block) {
    					if (dirty & /*invalid*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				(!current || dirty & /*iconDescription*/ 2) && { "aria-label": /*iconDescription*/ ctx[1] },
    				{ type: "button" },
    				{ tabindex: "0" },
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));

    			toggle_class(button, "bx--file-close", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(close.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(close.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(button);
    			destroy_component(close);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(33:0) {#if status === \\\"edit\\\"}",
    		ctx
    	});

    	return block;
    }

    // (34:2) {#if invalid}
    function create_if_block_2$2(ctx) {
    	let warningfilled;
    	let current;

    	warningfilled = new WarningFilled$1({
    			props: { class: "bx--file-invalid" },
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
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(34:2) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (50:0) {#if status === "complete"}
    function create_if_block$6(ctx) {
    	let checkmarkfilled;
    	let current;

    	const checkmarkfilled_spread_levels = [
    		{ "aria-label": /*iconDescription*/ ctx[1] },
    		{ title: /*iconDescription*/ ctx[1] },
    		{ class: "bx--file-complete" },
    		/*$$restProps*/ ctx[3]
    	];

    	let checkmarkfilled_props = {};

    	for (let i = 0; i < checkmarkfilled_spread_levels.length; i += 1) {
    		checkmarkfilled_props = assign(checkmarkfilled_props, checkmarkfilled_spread_levels[i]);
    	}

    	checkmarkfilled = new CheckmarkFilled$1({
    			props: checkmarkfilled_props,
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(checkmarkfilled.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkmarkfilled, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const checkmarkfilled_changes = (dirty & /*iconDescription, $$restProps*/ 10)
    			? get_spread_update(checkmarkfilled_spread_levels, [
    					dirty & /*iconDescription*/ 2 && { "aria-label": /*iconDescription*/ ctx[1] },
    					dirty & /*iconDescription*/ 2 && { title: /*iconDescription*/ ctx[1] },
    					checkmarkfilled_spread_levels[2],
    					dirty & /*$$restProps*/ 8 && get_spread_object(/*$$restProps*/ ctx[3])
    				])
    			: {};

    			checkmarkfilled.$set(checkmarkfilled_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkmarkfilled.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkmarkfilled.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkmarkfilled, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(50:0) {#if status === \\\"complete\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let t0;
    	let t1;
    	let if_block2_anchor;
    	let current;
    	let if_block0 = /*status*/ ctx[0] === "uploading" && create_if_block_3$2(ctx);
    	let if_block1 = /*status*/ ctx[0] === "edit" && create_if_block_1$4(ctx);
    	let if_block2 = /*status*/ ctx[0] === "complete" && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*status*/ ctx[0] === "uploading") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*status*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3$2(ctx);
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

    			if (/*status*/ ctx[0] === "edit") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*status*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$4(ctx);
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

    			if (/*status*/ ctx[0] === "complete") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*status*/ 1) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$6(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
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
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
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
    	const omit_props_names = ["status","iconDescription","invalid"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Filename', slots, []);
    	let { status = "uploading" } = $$props;
    	let { iconDescription = "" } = $$props;
    	let { invalid = false } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('status' in $$new_props) $$invalidate(0, status = $$new_props.status);
    		if ('iconDescription' in $$new_props) $$invalidate(1, iconDescription = $$new_props.iconDescription);
    		if ('invalid' in $$new_props) $$invalidate(2, invalid = $$new_props.invalid);
    	};

    	$$self.$capture_state = () => ({
    		status,
    		iconDescription,
    		invalid,
    		Close: Close$1,
    		CheckmarkFilled: CheckmarkFilled$1,
    		WarningFilled: WarningFilled$1,
    		Loading: Loading$1
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('status' in $$props) $$invalidate(0, status = $$new_props.status);
    		if ('iconDescription' in $$props) $$invalidate(1, iconDescription = $$new_props.iconDescription);
    		if ('invalid' in $$props) $$invalidate(2, invalid = $$new_props.invalid);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [status, iconDescription, invalid, $$restProps, click_handler, keydown_handler];
    }

    class Filename extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			status: 0,
    			iconDescription: 1,
    			invalid: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Filename",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get status() {
    		throw new Error("<Filename>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set status(value) {
    		throw new Error("<Filename>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDescription() {
    		throw new Error("<Filename>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDescription(value) {
    		throw new Error("<Filename>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<Filename>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<Filename>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Filename$1 = Filename;

    /* node_modules/carbon-components-svelte/src/FileUploader/FileUploaderItem.svelte generated by Svelte v3.55.1 */
    const file$8 = "node_modules/carbon-components-svelte/src/FileUploader/FileUploaderItem.svelte";

    // (70:2) {#if invalid && errorSubject}
    function create_if_block$5(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let if_block = /*errorBody*/ ctx[5] && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(/*errorSubject*/ ctx[4]);
    			t1 = space();
    			if (if_block) if_block.c();
    			toggle_class(div0, "bx--form-requirement__title", true);
    			add_location(div0, file$8, 71, 6, 1802);
    			toggle_class(div1, "bx--form-requirement", true);
    			add_location(div1, file$8, 70, 4, 1754);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);
    			if (if_block) if_block.m(div1, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*errorSubject*/ 16) set_data_dev(t0, /*errorSubject*/ ctx[4]);

    			if (/*errorBody*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$3(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(70:2) {#if invalid && errorSubject}",
    		ctx
    	});

    	return block;
    }

    // (73:6) {#if errorBody}
    function create_if_block_1$3(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*errorBody*/ ctx[5]);
    			toggle_class(p, "bx--form-requirement__supplement", true);
    			add_location(p, file$8, 73, 8, 1901);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*errorBody*/ 32) set_data_dev(t, /*errorBody*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(73:6) {#if errorBody}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let span1;
    	let p;
    	let t0;
    	let t1;
    	let span0;
    	let filename;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;

    	filename = new Filename$1({
    			props: {
    				iconDescription: /*iconDescription*/ ctx[2],
    				status: /*status*/ ctx[0],
    				invalid: /*invalid*/ ctx[3]
    			},
    			$$inline: true
    		});

    	filename.$on("keydown", /*keydown_handler*/ ctx[13]);
    	filename.$on("click", /*click_handler*/ ctx[14]);
    	let if_block = /*invalid*/ ctx[3] && /*errorSubject*/ ctx[4] && create_if_block$5(ctx);
    	let span1_levels = [{ id: /*id*/ ctx[6] }, /*$$restProps*/ ctx[9]];
    	let span1_data = {};

    	for (let i = 0; i < span1_levels.length; i += 1) {
    		span1_data = assign(span1_data, span1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			p = element("p");
    			t0 = text(/*name*/ ctx[7]);
    			t1 = space();
    			span0 = element("span");
    			create_component(filename.$$.fragment);
    			t2 = space();
    			if (if_block) if_block.c();
    			toggle_class(p, "bx--file-filename", true);
    			add_location(p, file$8, 53, 2, 1297);
    			toggle_class(span0, "bx--file__state-container", true);
    			add_location(span0, file$8, 54, 2, 1346);
    			set_attributes(span1, span1_data);
    			toggle_class(span1, "bx--file__selected-file", true);
    			toggle_class(span1, "bx--file__selected-file--invalid", /*invalid*/ ctx[3]);
    			toggle_class(span1, "bx--file__selected-file--md", /*size*/ ctx[1] === 'field');
    			toggle_class(span1, "bx--file__selected-file--sm", /*size*/ ctx[1] === 'small');
    			add_location(span1, file$8, 42, 0, 1001);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span1, anchor);
    			append_dev(span1, p);
    			append_dev(p, t0);
    			append_dev(span1, t1);
    			append_dev(span1, span0);
    			mount_component(filename, span0, null);
    			append_dev(span1, t2);
    			if (if_block) if_block.m(span1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "mouseover", /*mouseover_handler*/ ctx[10], false, false, false),
    					listen_dev(span1, "mouseenter", /*mouseenter_handler*/ ctx[11], false, false, false),
    					listen_dev(span1, "mouseleave", /*mouseleave_handler*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*name*/ 128) set_data_dev(t0, /*name*/ ctx[7]);
    			const filename_changes = {};
    			if (dirty & /*iconDescription*/ 4) filename_changes.iconDescription = /*iconDescription*/ ctx[2];
    			if (dirty & /*status*/ 1) filename_changes.status = /*status*/ ctx[0];
    			if (dirty & /*invalid*/ 8) filename_changes.invalid = /*invalid*/ ctx[3];
    			filename.$set(filename_changes);

    			if (/*invalid*/ ctx[3] && /*errorSubject*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(span1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_attributes(span1, span1_data = get_spread_update(span1_levels, [
    				(!current || dirty & /*id*/ 64) && { id: /*id*/ ctx[6] },
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9]
    			]));

    			toggle_class(span1, "bx--file__selected-file", true);
    			toggle_class(span1, "bx--file__selected-file--invalid", /*invalid*/ ctx[3]);
    			toggle_class(span1, "bx--file__selected-file--md", /*size*/ ctx[1] === 'field');
    			toggle_class(span1, "bx--file__selected-file--sm", /*size*/ ctx[1] === 'small');
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filename.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filename.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span1);
    			destroy_component(filename);
    			if (if_block) if_block.d();
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
    	const omit_props_names = [
    		"status","size","iconDescription","invalid","errorSubject","errorBody","id","name"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileUploaderItem', slots, []);
    	let { status = "uploading" } = $$props;
    	let { size = "default" } = $$props;
    	let { iconDescription = "" } = $$props;
    	let { invalid = false } = $$props;
    	let { errorSubject = "" } = $$props;
    	let { errorBody = "" } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { name = "" } = $$props;
    	const dispatch = createEventDispatcher();

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const keydown_handler = ({ key }) => {
    		if (key === ' ' || key === 'Enter') {
    			dispatch('delete', id);
    		}
    	};

    	const click_handler = () => {
    		dispatch('delete', id);
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('status' in $$new_props) $$invalidate(0, status = $$new_props.status);
    		if ('size' in $$new_props) $$invalidate(1, size = $$new_props.size);
    		if ('iconDescription' in $$new_props) $$invalidate(2, iconDescription = $$new_props.iconDescription);
    		if ('invalid' in $$new_props) $$invalidate(3, invalid = $$new_props.invalid);
    		if ('errorSubject' in $$new_props) $$invalidate(4, errorSubject = $$new_props.errorSubject);
    		if ('errorBody' in $$new_props) $$invalidate(5, errorBody = $$new_props.errorBody);
    		if ('id' in $$new_props) $$invalidate(6, id = $$new_props.id);
    		if ('name' in $$new_props) $$invalidate(7, name = $$new_props.name);
    	};

    	$$self.$capture_state = () => ({
    		status,
    		size,
    		iconDescription,
    		invalid,
    		errorSubject,
    		errorBody,
    		id,
    		name,
    		createEventDispatcher,
    		Filename: Filename$1,
    		dispatch
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('status' in $$props) $$invalidate(0, status = $$new_props.status);
    		if ('size' in $$props) $$invalidate(1, size = $$new_props.size);
    		if ('iconDescription' in $$props) $$invalidate(2, iconDescription = $$new_props.iconDescription);
    		if ('invalid' in $$props) $$invalidate(3, invalid = $$new_props.invalid);
    		if ('errorSubject' in $$props) $$invalidate(4, errorSubject = $$new_props.errorSubject);
    		if ('errorBody' in $$props) $$invalidate(5, errorBody = $$new_props.errorBody);
    		if ('id' in $$props) $$invalidate(6, id = $$new_props.id);
    		if ('name' in $$props) $$invalidate(7, name = $$new_props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		status,
    		size,
    		iconDescription,
    		invalid,
    		errorSubject,
    		errorBody,
    		id,
    		name,
    		dispatch,
    		$$restProps,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keydown_handler,
    		click_handler
    	];
    }

    class FileUploaderItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			status: 0,
    			size: 1,
    			iconDescription: 2,
    			invalid: 3,
    			errorSubject: 4,
    			errorBody: 5,
    			id: 6,
    			name: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileUploaderItem",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get status() {
    		throw new Error("<FileUploaderItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set status(value) {
    		throw new Error("<FileUploaderItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<FileUploaderItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<FileUploaderItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDescription() {
    		throw new Error("<FileUploaderItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDescription(value) {
    		throw new Error("<FileUploaderItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<FileUploaderItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<FileUploaderItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get errorSubject() {
    		throw new Error("<FileUploaderItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set errorSubject(value) {
    		throw new Error("<FileUploaderItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get errorBody() {
    		throw new Error("<FileUploaderItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set errorBody(value) {
    		throw new Error("<FileUploaderItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<FileUploaderItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<FileUploaderItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<FileUploaderItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<FileUploaderItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var FileUploaderItem$1 = FileUploaderItem;

    /* node_modules/carbon-components-svelte/src/icons/ErrorFilled.svelte generated by Svelte v3.55.1 */

    const file$7 = "node_modules/carbon-components-svelte/src/icons/ErrorFilled.svelte";

    // (24:2) {#if title}
    function create_if_block$4(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$7, 23, 13, 549);
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

    function create_fragment$7(ctx) {
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
    			attr_dev(path0, "d", "M14.9 7.2H17.1V24.799H14.9z");
    			attr_dev(path0, "data-icon-path", "inner-path");
    			attr_dev(path0, "transform", "rotate(-45 16 16)");
    			add_location(path0, file$7, 24, 2, 579);
    			attr_dev(path1, "d", "M16,2A13.914,13.914,0,0,0,2,16,13.914,13.914,0,0,0,16,30,13.914,13.914,0,0,0,30,16,13.914,13.914,0,0,0,16,2Zm5.4449,21L9,10.5557,10.5557,9,23,21.4448Z");
    			add_location(path1, file$7, 28, 41, 710);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$7, 13, 0, 338);
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ErrorFilled",
    			options,
    			id: create_fragment$7.name
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

    /* node_modules/carbon-components-svelte/src/MultiSelect/MultiSelect.svelte generated by Svelte v3.55.1 */

    const file$6 = "node_modules/carbon-components-svelte/src/MultiSelect/MultiSelect.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[73] = list[i];
    	child_ctx[75] = i;
    	return child_ctx;
    }

    const get_default_slot_changes = dirty => ({
    	item: dirty[0] & /*filterable, filteredItems, sortedItems*/ 1610616832,
    	index: dirty[0] & /*filterable, filteredItems, sortedItems*/ 1610616832
    });

    const get_default_slot_context = ctx => ({
    	slot: "labelText",
    	item: /*item*/ ctx[73],
    	index: /*i*/ ctx[75]
    });

    // (296:2) {#if titleText}
    function create_if_block_9(ctx) {
    	let label_1;
    	let t;

    	const block = {
    		c: function create() {
    			label_1 = element("label");
    			t = text(/*titleText*/ ctx[17]);
    			attr_dev(label_1, "for", /*id*/ ctx[26]);
    			toggle_class(label_1, "bx--label", true);
    			toggle_class(label_1, "bx--label--disabled", /*disabled*/ ctx[11]);
    			toggle_class(label_1, "bx--visually-hidden", /*hideLabel*/ ctx[25]);
    			add_location(label_1, file$6, 296, 4, 7909);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label_1, anchor);
    			append_dev(label_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*titleText*/ 131072) set_data_dev(t, /*titleText*/ ctx[17]);

    			if (dirty[0] & /*id*/ 67108864) {
    				attr_dev(label_1, "for", /*id*/ ctx[26]);
    			}

    			if (dirty[0] & /*disabled*/ 2048) {
    				toggle_class(label_1, "bx--label--disabled", /*disabled*/ ctx[11]);
    			}

    			if (dirty[0] & /*hideLabel*/ 33554432) {
    				toggle_class(label_1, "bx--visually-hidden", /*hideLabel*/ ctx[25]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(296:2) {#if titleText}",
    		ctx
    	});

    	return block;
    }

    // (323:4) {#if invalid}
    function create_if_block_8(ctx) {
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
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(323:4) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (326:4) {#if !invalid && warn}
    function create_if_block_7(ctx) {
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
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(326:4) {#if !invalid && warn}",
    		ctx
    	});

    	return block;
    }

    // (389:6) {#if checked.length > 0}
    function create_if_block_6(ctx) {
    	let listboxselection;
    	let current;

    	listboxselection = new ListBoxSelection$1({
    			props: {
    				selectionCount: /*checked*/ ctx[31].length,
    				translateWithId: /*translateWithIdSelection*/ ctx[16],
    				disabled: /*disabled*/ ctx[11]
    			},
    			$$inline: true
    		});

    	listboxselection.$on("clear", /*clear_handler*/ ctx[52]);
    	listboxselection.$on("clear", /*clear_handler_1*/ ctx[53]);

    	const block = {
    		c: function create() {
    			create_component(listboxselection.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(listboxselection, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const listboxselection_changes = {};
    			if (dirty[1] & /*checked*/ 1) listboxselection_changes.selectionCount = /*checked*/ ctx[31].length;
    			if (dirty[0] & /*translateWithIdSelection*/ 65536) listboxselection_changes.translateWithId = /*translateWithIdSelection*/ ctx[16];
    			if (dirty[0] & /*disabled*/ 2048) listboxselection_changes.disabled = /*disabled*/ ctx[11];
    			listboxselection.$set(listboxselection_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(listboxselection.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(listboxselection.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(listboxselection, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(389:6) {#if checked.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (404:6) {#if filterable}
    function create_if_block_3$1(ctx) {
    	let input;
    	let t0;
    	let t1;
    	let t2;
    	let listboxmenuicon;
    	let current;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[37],
    		{ role: "combobox" },
    		{ tabindex: "0" },
    		{ autocomplete: "off" },
    		{ "aria-autocomplete": "list" },
    		{ "aria-expanded": /*open*/ ctx[1] },
    		{
    			"aria-activedescendant": /*highlightedId*/ ctx[6]
    		},
    		{ "aria-disabled": /*disabled*/ ctx[11] },
    		{ "aria-controls": /*menuId*/ ctx[34] },
    		{ disabled: /*disabled*/ ctx[11] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ id: /*id*/ ctx[26] },
    		{ name: /*name*/ ctx[27] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	let if_block0 = /*invalid*/ ctx[19] && create_if_block_5(ctx);
    	let if_block1 = /*value*/ ctx[0] && create_if_block_4$1(ctx);

    	listboxmenuicon = new ListBoxMenuIcon$1({
    			props: {
    				style: "pointer-events: " + (/*open*/ ctx[1] ? 'auto' : 'none'),
    				translateWithId: /*translateWithId*/ ctx[15],
    				open: /*open*/ ctx[1]
    			},
    			$$inline: true
    		});

    	listboxmenuicon.$on("click", /*click_handler_1*/ ctx[58]);

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			create_component(listboxmenuicon.$$.fragment);
    			set_attributes(input, input_data);
    			toggle_class(input, "bx--text-input", true);
    			toggle_class(input, "bx--text-input--empty", /*value*/ ctx[0] === '');
    			toggle_class(input, "bx--text-input--light", /*light*/ ctx[13]);
    			add_location(input, file$6, 404, 8, 10881);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			/*input_binding*/ ctx[54](input);
    			set_input_value(input, /*value*/ ctx[0]);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(listboxmenuicon, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[55]),
    					listen_dev(input, "keydown", /*keydown_handler*/ ctx[46], false, false, false),
    					listen_dev(input, "keydown", stop_propagation(/*keydown_handler_1*/ ctx[56]), false, false, true),
    					listen_dev(input, "keyup", /*keyup_handler*/ ctx[47], false, false, false),
    					listen_dev(input, "focus", /*focus_handler*/ ctx[48], false, false, false),
    					listen_dev(input, "blur", /*blur_handler*/ ctx[49], false, false, false),
    					listen_dev(input, "paste", /*paste_handler*/ ctx[50], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[1] & /*$$restProps*/ 64 && /*$$restProps*/ ctx[37],
    				{ role: "combobox" },
    				{ tabindex: "0" },
    				{ autocomplete: "off" },
    				{ "aria-autocomplete": "list" },
    				(!current || dirty[0] & /*open*/ 2) && { "aria-expanded": /*open*/ ctx[1] },
    				(!current || dirty[0] & /*highlightedId*/ 64) && {
    					"aria-activedescendant": /*highlightedId*/ ctx[6]
    				},
    				(!current || dirty[0] & /*disabled*/ 2048) && { "aria-disabled": /*disabled*/ ctx[11] },
    				(!current || dirty[1] & /*menuId*/ 8) && { "aria-controls": /*menuId*/ ctx[34] },
    				(!current || dirty[0] & /*disabled*/ 2048) && { disabled: /*disabled*/ ctx[11] },
    				(!current || dirty[0] & /*placeholder*/ 16384) && { placeholder: /*placeholder*/ ctx[14] },
    				(!current || dirty[0] & /*id*/ 67108864) && { id: /*id*/ ctx[26] },
    				(!current || dirty[0] & /*name*/ 134217728) && { name: /*name*/ ctx[27] }
    			]));

    			if (dirty[0] & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			toggle_class(input, "bx--text-input", true);
    			toggle_class(input, "bx--text-input--empty", /*value*/ ctx[0] === '');
    			toggle_class(input, "bx--text-input--light", /*light*/ ctx[13]);

    			if (/*invalid*/ ctx[19]) {
    				if (if_block0) {
    					if (dirty[0] & /*invalid*/ 524288) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*value*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*value*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_4$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t2.parentNode, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const listboxmenuicon_changes = {};
    			if (dirty[0] & /*open*/ 2) listboxmenuicon_changes.style = "pointer-events: " + (/*open*/ ctx[1] ? 'auto' : 'none');
    			if (dirty[0] & /*translateWithId*/ 32768) listboxmenuicon_changes.translateWithId = /*translateWithId*/ ctx[15];
    			if (dirty[0] & /*open*/ 2) listboxmenuicon_changes.open = /*open*/ ctx[1];
    			listboxmenuicon.$set(listboxmenuicon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(listboxmenuicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(listboxmenuicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding*/ ctx[54](null);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(listboxmenuicon, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(404:6) {#if filterable}",
    		ctx
    	});

    	return block;
    }

    // (454:8) {#if invalid}
    function create_if_block_5(ctx) {
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
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(454:8) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (457:8) {#if value}
    function create_if_block_4$1(ctx) {
    	let listboxselection;
    	let current;

    	listboxselection = new ListBoxSelection$1({
    			props: {
    				translateWithId: /*translateWithIdSelection*/ ctx[16],
    				disabled: /*disabled*/ ctx[11],
    				open: /*open*/ ctx[1]
    			},
    			$$inline: true
    		});

    	listboxselection.$on("clear", /*clear_handler_2*/ ctx[57]);

    	const block = {
    		c: function create() {
    			create_component(listboxselection.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(listboxselection, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const listboxselection_changes = {};
    			if (dirty[0] & /*translateWithIdSelection*/ 65536) listboxselection_changes.translateWithId = /*translateWithIdSelection*/ ctx[16];
    			if (dirty[0] & /*disabled*/ 2048) listboxselection_changes.disabled = /*disabled*/ ctx[11];
    			if (dirty[0] & /*open*/ 2) listboxselection_changes.open = /*open*/ ctx[1];
    			listboxselection.$set(listboxselection_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(listboxselection.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(listboxselection.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(listboxselection, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(457:8) {#if value}",
    		ctx
    	});

    	return block;
    }

    // (478:6) {#if !filterable}
    function create_if_block_2$1(ctx) {
    	let span;
    	let t0;
    	let t1;
    	let listboxmenuicon;
    	let current;

    	listboxmenuicon = new ListBoxMenuIcon$1({
    			props: {
    				open: /*open*/ ctx[1],
    				translateWithId: /*translateWithId*/ ctx[15]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(/*label*/ ctx[24]);
    			t1 = space();
    			create_component(listboxmenuicon.$$.fragment);
    			toggle_class(span, "bx--list-box__label", true);
    			add_location(span, file$6, 478, 8, 13201);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(listboxmenuicon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*label*/ 16777216) set_data_dev(t0, /*label*/ ctx[24]);
    			const listboxmenuicon_changes = {};
    			if (dirty[0] & /*open*/ 2) listboxmenuicon_changes.open = /*open*/ ctx[1];
    			if (dirty[0] & /*translateWithId*/ 32768) listboxmenuicon_changes.translateWithId = /*translateWithId*/ ctx[15];
    			listboxmenuicon.$set(listboxmenuicon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(listboxmenuicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(listboxmenuicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			destroy_component(listboxmenuicon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(478:6) {#if !filterable}",
    		ctx
    	});

    	return block;
    }

    // (331:4) <ListBoxField       role="button"       tabindex="0"       aria-expanded="{open}"       on:click="{() => {         if (disabled) return;         if (filterable) {           open = true;           inputRef.focus();         } else {           open = !open;         }       }}"       on:keydown="{(e) => {         if (filterable) {           return;         }         const key = e.key;         if ([' ', 'ArrowUp', 'ArrowDown'].includes(key)) {           e.preventDefault();         }         if (key === ' ') {           open = !open;         } else if (key === 'Tab') {           if (selectionRef && checked.length > 0) {             selectionRef.focus();           } else {             open = false;             fieldRef.blur();           }         } else if (key === 'ArrowDown') {           change(1);         } else if (key === 'ArrowUp') {           change(-1);         } else if (key === 'Enter') {           if (highlightedIndex > -1) {             sortedItems = sortedItems.map((item, i) => {               if (i !== highlightedIndex) return item;               return { ...item, checked: !item.checked };             });           }         } else if (key === 'Escape') {           open = false;         }       }}"       on:focus="{() => {         if (filterable) {           open = true;           if (inputRef) inputRef.focus();         }       }}"       on:blur="{(e) => {         if (!filterable) dispatch('blur', e);       }}"       id="{id}"       disabled="{disabled}"       translateWithId="{translateWithId}"     >
    function create_default_slot_3(ctx) {
    	let t0;
    	let t1;
    	let if_block2_anchor;
    	let current;
    	let if_block0 = /*checked*/ ctx[31].length > 0 && create_if_block_6(ctx);
    	let if_block1 = /*filterable*/ ctx[12] && create_if_block_3$1(ctx);
    	let if_block2 = !/*filterable*/ ctx[12] && create_if_block_2$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*checked*/ ctx[31].length > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[1] & /*checked*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_6(ctx);
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

    			if (/*filterable*/ ctx[12]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*filterable*/ 4096) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_3$1(ctx);
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

    			if (!/*filterable*/ ctx[12]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*filterable*/ 4096) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_2$1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
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
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(331:4) <ListBoxField       role=\\\"button\\\"       tabindex=\\\"0\\\"       aria-expanded=\\\"{open}\\\"       on:click=\\\"{() => {         if (disabled) return;         if (filterable) {           open = true;           inputRef.focus();         } else {           open = !open;         }       }}\\\"       on:keydown=\\\"{(e) => {         if (filterable) {           return;         }         const key = e.key;         if ([' ', 'ArrowUp', 'ArrowDown'].includes(key)) {           e.preventDefault();         }         if (key === ' ') {           open = !open;         } else if (key === 'Tab') {           if (selectionRef && checked.length > 0) {             selectionRef.focus();           } else {             open = false;             fieldRef.blur();           }         } else if (key === 'ArrowDown') {           change(1);         } else if (key === 'ArrowUp') {           change(-1);         } else if (key === 'Enter') {           if (highlightedIndex > -1) {             sortedItems = sortedItems.map((item, i) => {               if (i !== highlightedIndex) return item;               return { ...item, checked: !item.checked };             });           }         } else if (key === 'Escape') {           open = false;         }       }}\\\"       on:focus=\\\"{() => {         if (filterable) {           open = true;           if (inputRef) inputRef.focus();         }       }}\\\"       on:blur=\\\"{(e) => {         if (!filterable) dispatch('blur', e);       }}\\\"       id=\\\"{id}\\\"       disabled=\\\"{disabled}\\\"       translateWithId=\\\"{translateWithId}\\\"     >",
    		ctx
    	});

    	return block;
    }

    // (483:4) {#if open}
    function create_if_block_1$2(ctx) {
    	let listboxmenu;
    	let current;

    	listboxmenu = new ListBoxMenu$1({
    			props: {
    				"aria-label": /*ariaLabel*/ ctx[32],
    				id: /*id*/ ctx[26],
    				"aria-multiselectable": "true",
    				$$slots: { default: [create_default_slot_1] },
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
    			if (dirty[1] & /*ariaLabel*/ 2) listboxmenu_changes["aria-label"] = /*ariaLabel*/ ctx[32];
    			if (dirty[0] & /*id*/ 67108864) listboxmenu_changes.id = /*id*/ ctx[26];

    			if (dirty[0] & /*filterable, filteredItems, sortedItems, highlightedIndex, fieldRef, useTitleInItem, itemToString, itemToInput, open*/ 1879314834 | dirty[2] & /*$$scope*/ 32) {
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
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(483:4) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (526:63)
    function fallback_block$3(ctx) {
    	let t_value = /*itemToString*/ ctx[7](/*item*/ ctx[73]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*itemToString, filterable, filteredItems, sortedItems*/ 1610616960 && t_value !== (t_value = /*itemToString*/ ctx[7](/*item*/ ctx[73]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$3.name,
    		type: "fallback",
    		source: "(526:63)                  ",
    		ctx
    	});

    	return block;
    }

    // (526:14)
    function create_labelText_slot(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[45].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[67], get_default_slot_context);
    	const default_slot_or_fallback = default_slot || fallback_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*filterable, filteredItems, sortedItems*/ 1610616832 | dirty[2] & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[67],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[67])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[67], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty[0] & /*itemToString, filterable, filteredItems, sortedItems*/ 1610616960)) {
    					default_slot_or_fallback.p(ctx, !current ? [-1, -1, -1] : dirty);
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
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_labelText_slot.name,
    		type: "slot",
    		source: "(526:14) ",
    		ctx
    	});

    	return block;
    }

    // (490:10) <ListBoxMenuItem             id="{item.id}"             role="option"             aria-labelledby="checkbox-{item.id}"             aria-selected="{item.checked}"             active="{item.checked}"             highlighted="{highlightedIndex === i}"             disabled="{item.disabled}"             on:click="{(e) => {               if (item.disabled) {                 e.stopPropagation();                 return;               }               sortedItems = sortedItems.map((_) =>                 _.id === item.id ? { ..._, checked: !_.checked } : _               );               fieldRef.focus();             }}"             on:mouseenter="{() => {               if (item.disabled) return;               highlightedIndex = i;             }}"           >
    function create_default_slot_2(ctx) {
    	let checkbox;
    	let t;
    	let current;

    	const checkbox_spread_levels = [
    		{ name: /*item*/ ctx[73].id },
    		{
    			title: /*useTitleInItem*/ ctx[18]
    			? /*itemToString*/ ctx[7](/*item*/ ctx[73])
    			: undefined
    		},
    		/*itemToInput*/ ctx[8](/*item*/ ctx[73]),
    		{ readonly: true },
    		{ tabindex: "-1" },
    		{ id: "checkbox-" + /*item*/ ctx[73].id },
    		{ checked: /*item*/ ctx[73].checked },
    		{ disabled: /*item*/ ctx[73].disabled }
    	];

    	function blur_handler_2() {
    		return /*blur_handler_2*/ ctx[63](/*i*/ ctx[75]);
    	}

    	let checkbox_props = {
    		$$slots: { labelText: [create_labelText_slot] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < checkbox_spread_levels.length; i += 1) {
    		checkbox_props = assign(checkbox_props, checkbox_spread_levels[i]);
    	}

    	checkbox = new Checkbox$1({ props: checkbox_props, $$inline: true });
    	checkbox.$on("blur", blur_handler_2);

    	const block = {
    		c: function create() {
    			create_component(checkbox.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkbox, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			const checkbox_changes = (dirty[0] & /*filterable, filteredItems, sortedItems, useTitleInItem, itemToString, itemToInput*/ 1610879360)
    			? get_spread_update(checkbox_spread_levels, [
    					dirty[0] & /*filterable, filteredItems, sortedItems*/ 1610616832 && { name: /*item*/ ctx[73].id },
    					dirty[0] & /*useTitleInItem, itemToString, filterable, filteredItems, sortedItems*/ 1610879104 && {
    						title: /*useTitleInItem*/ ctx[18]
    						? /*itemToString*/ ctx[7](/*item*/ ctx[73])
    						: undefined
    					},
    					dirty[0] & /*itemToInput, filterable, filteredItems, sortedItems*/ 1610617088 && get_spread_object(/*itemToInput*/ ctx[8](/*item*/ ctx[73])),
    					checkbox_spread_levels[3],
    					checkbox_spread_levels[4],
    					dirty[0] & /*filterable, filteredItems, sortedItems*/ 1610616832 && { id: "checkbox-" + /*item*/ ctx[73].id },
    					dirty[0] & /*filterable, filteredItems, sortedItems*/ 1610616832 && { checked: /*item*/ ctx[73].checked },
    					dirty[0] & /*filterable, filteredItems, sortedItems*/ 1610616832 && { disabled: /*item*/ ctx[73].disabled }
    				])
    			: {};

    			if (dirty[0] & /*itemToString, filterable, filteredItems, sortedItems*/ 1610616960 | dirty[2] & /*$$scope*/ 32) {
    				checkbox_changes.$$scope = { dirty, ctx };
    			}

    			checkbox.$set(checkbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkbox, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(490:10) <ListBoxMenuItem             id=\\\"{item.id}\\\"             role=\\\"option\\\"             aria-labelledby=\\\"checkbox-{item.id}\\\"             aria-selected=\\\"{item.checked}\\\"             active=\\\"{item.checked}\\\"             highlighted=\\\"{highlightedIndex === i}\\\"             disabled=\\\"{item.disabled}\\\"             on:click=\\\"{(e) => {               if (item.disabled) {                 e.stopPropagation();                 return;               }               sortedItems = sortedItems.map((_) =>                 _.id === item.id ? { ..._, checked: !_.checked } : _               );               fieldRef.focus();             }}\\\"             on:mouseenter=\\\"{() => {               if (item.disabled) return;               highlightedIndex = i;             }}\\\"           >",
    		ctx
    	});

    	return block;
    }

    // (489:8) {#each filterable ? filteredItems : sortedItems as item, i (item.id)}
    function create_each_block$1(key_1, ctx) {
    	let first;
    	let listboxmenuitem;
    	let current;

    	function click_handler_3(...args) {
    		return /*click_handler_3*/ ctx[64](/*item*/ ctx[73], ...args);
    	}

    	function mouseenter_handler() {
    		return /*mouseenter_handler*/ ctx[65](/*item*/ ctx[73], /*i*/ ctx[75]);
    	}

    	listboxmenuitem = new ListBoxMenuItem$1({
    			props: {
    				id: /*item*/ ctx[73].id,
    				role: "option",
    				"aria-labelledby": "checkbox-" + /*item*/ ctx[73].id,
    				"aria-selected": /*item*/ ctx[73].checked,
    				active: /*item*/ ctx[73].checked,
    				highlighted: /*highlightedIndex*/ ctx[28] === /*i*/ ctx[75],
    				disabled: /*item*/ ctx[73].disabled,
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	listboxmenuitem.$on("click", click_handler_3);
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
    			if (dirty[0] & /*filterable, filteredItems, sortedItems*/ 1610616832) listboxmenuitem_changes.id = /*item*/ ctx[73].id;
    			if (dirty[0] & /*filterable, filteredItems, sortedItems*/ 1610616832) listboxmenuitem_changes["aria-labelledby"] = "checkbox-" + /*item*/ ctx[73].id;
    			if (dirty[0] & /*filterable, filteredItems, sortedItems*/ 1610616832) listboxmenuitem_changes["aria-selected"] = /*item*/ ctx[73].checked;
    			if (dirty[0] & /*filterable, filteredItems, sortedItems*/ 1610616832) listboxmenuitem_changes.active = /*item*/ ctx[73].checked;
    			if (dirty[0] & /*highlightedIndex, filterable, filteredItems, sortedItems*/ 1879052288) listboxmenuitem_changes.highlighted = /*highlightedIndex*/ ctx[28] === /*i*/ ctx[75];
    			if (dirty[0] & /*filterable, filteredItems, sortedItems*/ 1610616832) listboxmenuitem_changes.disabled = /*item*/ ctx[73].disabled;

    			if (dirty[0] & /*filterable, filteredItems, sortedItems, useTitleInItem, itemToString, itemToInput, open*/ 1610879362 | dirty[2] & /*$$scope*/ 32) {
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
    		source: "(489:8) {#each filterable ? filteredItems : sortedItems as item, i (item.id)}",
    		ctx
    	});

    	return block;
    }

    // (484:6) <ListBoxMenu         aria-label="{ariaLabel}"         id="{id}"         aria-multiselectable="true"       >
    function create_default_slot_1(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;

    	let each_value = /*filterable*/ ctx[12]
    	? /*filteredItems*/ ctx[30]
    	: /*sortedItems*/ ctx[29];

    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[73].id;
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
    			if (dirty[0] & /*filterable, filteredItems, sortedItems, highlightedIndex, fieldRef, useTitleInItem, itemToString, itemToInput, open*/ 1879314834 | dirty[2] & /*$$scope*/ 32) {
    				each_value = /*filterable*/ ctx[12]
    				? /*filteredItems*/ ctx[30]
    				: /*sortedItems*/ ctx[29];

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
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(484:6) <ListBoxMenu         aria-label=\\\"{ariaLabel}\\\"         id=\\\"{id}\\\"         aria-multiselectable=\\\"true\\\"       >",
    		ctx
    	});

    	return block;
    }

    // (306:2) <ListBox     role="{undefined}"     disabled="{disabled}"     invalid="{invalid}"     invalidText="{invalidText}"     open="{open}"     light="{light}"     size="{size}"     warn="{warn}"     warnText="{warnText}"     class="bx--multi-select {direction === 'top' &&       'bx--list-box--up'} {filterable && 'bx--combo-box'}       {filterable && 'bx--multi-select--filterable'}       {invalid && 'bx--multi-select--invalid'}       {inline && 'bx--multi-select--inline'}       {checked.length > 0 && 'bx--multi-select--selected'}"   >
    function create_default_slot$1(ctx) {
    	let t0;
    	let t1;
    	let listboxfield;
    	let t2;
    	let if_block2_anchor;
    	let current;
    	let if_block0 = /*invalid*/ ctx[19] && create_if_block_8(ctx);
    	let if_block1 = !/*invalid*/ ctx[19] && /*warn*/ ctx[21] && create_if_block_7(ctx);

    	listboxfield = new ListBoxField$1({
    			props: {
    				role: "button",
    				tabindex: "0",
    				"aria-expanded": /*open*/ ctx[1],
    				id: /*id*/ ctx[26],
    				disabled: /*disabled*/ ctx[11],
    				translateWithId: /*translateWithId*/ ctx[15],
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	listboxfield.$on("click", /*click_handler_2*/ ctx[59]);
    	listboxfield.$on("keydown", /*keydown_handler_2*/ ctx[60]);
    	listboxfield.$on("focus", /*focus_handler_1*/ ctx[61]);
    	listboxfield.$on("blur", /*blur_handler_1*/ ctx[62]);
    	let if_block2 = /*open*/ ctx[1] && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			create_component(listboxfield.$$.fragment);
    			t2 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(listboxfield, target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*invalid*/ ctx[19]) {
    				if (if_block0) {
    					if (dirty[0] & /*invalid*/ 524288) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_8(ctx);
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

    			if (!/*invalid*/ ctx[19] && /*warn*/ ctx[21]) {
    				if (if_block1) {
    					if (dirty[0] & /*invalid, warn*/ 2621440) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_7(ctx);
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

    			const listboxfield_changes = {};
    			if (dirty[0] & /*open*/ 2) listboxfield_changes["aria-expanded"] = /*open*/ ctx[1];
    			if (dirty[0] & /*id*/ 67108864) listboxfield_changes.id = /*id*/ ctx[26];
    			if (dirty[0] & /*disabled*/ 2048) listboxfield_changes.disabled = /*disabled*/ ctx[11];
    			if (dirty[0] & /*translateWithId*/ 32768) listboxfield_changes.translateWithId = /*translateWithId*/ ctx[15];

    			if (dirty[0] & /*open, translateWithId, label, filterable, translateWithIdSelection, disabled, value, invalid, highlightedId, placeholder, id, name, inputRef, light, sortedItems, fieldRef*/ 755628119 | dirty[1] & /*$$restProps, menuId, checked*/ 73 | dirty[2] & /*$$scope*/ 32) {
    				listboxfield_changes.$$scope = { dirty, ctx };
    			}

    			listboxfield.$set(listboxfield_changes);

    			if (/*open*/ ctx[1]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*open*/ 2) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1$2(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(listboxfield.$$.fragment, local);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(listboxfield.$$.fragment, local);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(listboxfield, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(306:2) <ListBox     role=\\\"{undefined}\\\"     disabled=\\\"{disabled}\\\"     invalid=\\\"{invalid}\\\"     invalidText=\\\"{invalidText}\\\"     open=\\\"{open}\\\"     light=\\\"{light}\\\"     size=\\\"{size}\\\"     warn=\\\"{warn}\\\"     warnText=\\\"{warnText}\\\"     class=\\\"bx--multi-select {direction === 'top' &&       'bx--list-box--up'} {filterable && 'bx--combo-box'}       {filterable && 'bx--multi-select--filterable'}       {invalid && 'bx--multi-select--invalid'}       {inline && 'bx--multi-select--inline'}       {checked.length > 0 && 'bx--multi-select--selected'}\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (535:2) {#if !inline && !invalid && !warn && helperText}
    function create_if_block$3(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*helperText*/ ctx[23]);
    			toggle_class(div, "bx--form__helper-text", true);
    			toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[11]);
    			add_location(div, file$6, 535, 4, 15094);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*helperText*/ 8388608) set_data_dev(t, /*helperText*/ ctx[23]);

    			if (dirty[0] & /*disabled*/ 2048) {
    				toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[11]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(535:2) {#if !inline && !invalid && !warn && helperText}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let t0;
    	let listbox;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*titleText*/ ctx[17] && create_if_block_9(ctx);

    	listbox = new ListBox$1({
    			props: {
    				role: undefined,
    				disabled: /*disabled*/ ctx[11],
    				invalid: /*invalid*/ ctx[19],
    				invalidText: /*invalidText*/ ctx[20],
    				open: /*open*/ ctx[1],
    				light: /*light*/ ctx[13],
    				size: /*size*/ ctx[9],
    				warn: /*warn*/ ctx[21],
    				warnText: /*warnText*/ ctx[22],
    				class: "bx--multi-select " + (/*direction*/ ctx[10] === 'top' && 'bx--list-box--up') + " " + (/*filterable*/ ctx[12] && 'bx--combo-box') + "\n      " + (/*filterable*/ ctx[12] && 'bx--multi-select--filterable') + "\n      " + (/*invalid*/ ctx[19] && 'bx--multi-select--invalid') + "\n      " + (/*inline*/ ctx[33] && 'bx--multi-select--inline') + "\n      " + (/*checked*/ ctx[31].length > 0 && 'bx--multi-select--selected'),
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block1 = !/*inline*/ ctx[33] && !/*invalid*/ ctx[19] && !/*warn*/ ctx[21] && /*helperText*/ ctx[23] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			create_component(listbox.$$.fragment);
    			t1 = space();
    			if (if_block1) if_block1.c();
    			toggle_class(div, "bx--multi-select__wrapper", true);
    			toggle_class(div, "bx--list-box__wrapper", true);
    			toggle_class(div, "bx--multi-select__wrapper--inline", /*inline*/ ctx[33]);
    			toggle_class(div, "bx--list-box__wrapper--inline", /*inline*/ ctx[33]);
    			toggle_class(div, "bx--multi-select__wrapper--inline--invalid", /*inline*/ ctx[33] && /*invalid*/ ctx[19]);
    			add_location(div, file$6, 287, 0, 7592);
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
    			/*div_binding*/ ctx[66](div);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "click", /*click_handler*/ ctx[51], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*titleText*/ ctx[17]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_9(ctx);
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			const listbox_changes = {};
    			if (dirty[0] & /*disabled*/ 2048) listbox_changes.disabled = /*disabled*/ ctx[11];
    			if (dirty[0] & /*invalid*/ 524288) listbox_changes.invalid = /*invalid*/ ctx[19];
    			if (dirty[0] & /*invalidText*/ 1048576) listbox_changes.invalidText = /*invalidText*/ ctx[20];
    			if (dirty[0] & /*open*/ 2) listbox_changes.open = /*open*/ ctx[1];
    			if (dirty[0] & /*light*/ 8192) listbox_changes.light = /*light*/ ctx[13];
    			if (dirty[0] & /*size*/ 512) listbox_changes.size = /*size*/ ctx[9];
    			if (dirty[0] & /*warn*/ 2097152) listbox_changes.warn = /*warn*/ ctx[21];
    			if (dirty[0] & /*warnText*/ 4194304) listbox_changes.warnText = /*warnText*/ ctx[22];
    			if (dirty[0] & /*direction, filterable, invalid*/ 529408 | dirty[1] & /*inline, checked*/ 5) listbox_changes.class = "bx--multi-select " + (/*direction*/ ctx[10] === 'top' && 'bx--list-box--up') + " " + (/*filterable*/ ctx[12] && 'bx--combo-box') + "\n      " + (/*filterable*/ ctx[12] && 'bx--multi-select--filterable') + "\n      " + (/*invalid*/ ctx[19] && 'bx--multi-select--invalid') + "\n      " + (/*inline*/ ctx[33] && 'bx--multi-select--inline') + "\n      " + (/*checked*/ ctx[31].length > 0 && 'bx--multi-select--selected');

    			if (dirty[0] & /*id, filterable, filteredItems, sortedItems, highlightedIndex, fieldRef, useTitleInItem, itemToString, itemToInput, open, disabled, translateWithId, inputRef, selectionRef, label, translateWithIdSelection, value, invalid, highlightedId, placeholder, name, light, warn*/ 2100165111 | dirty[1] & /*ariaLabel, checked, $$restProps, menuId*/ 75 | dirty[2] & /*$$scope*/ 32) {
    				listbox_changes.$$scope = { dirty, ctx };
    			}

    			listbox.$set(listbox_changes);

    			if (!/*inline*/ ctx[33] && !/*invalid*/ ctx[19] && !/*warn*/ ctx[21] && /*helperText*/ ctx[23]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!current || dirty[1] & /*inline*/ 4) {
    				toggle_class(div, "bx--multi-select__wrapper--inline", /*inline*/ ctx[33]);
    			}

    			if (!current || dirty[1] & /*inline*/ 4) {
    				toggle_class(div, "bx--list-box__wrapper--inline", /*inline*/ ctx[33]);
    			}

    			if (!current || dirty[0] & /*invalid*/ 524288 | dirty[1] & /*inline*/ 4) {
    				toggle_class(div, "bx--multi-select__wrapper--inline--invalid", /*inline*/ ctx[33] && /*invalid*/ ctx[19]);
    			}
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
    			/*div_binding*/ ctx[66](null);
    			mounted = false;
    			dispose();
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
    	let menuId;
    	let inline;
    	let ariaLabel;
    	let sortedItems;
    	let checked;
    	let unchecked;
    	let filteredItems;

    	const omit_props_names = [
    		"items","itemToString","itemToInput","selectedIds","value","size","type","direction","selectionFeedback","disabled","filterable","filterItem","open","light","locale","placeholder","sortItem","translateWithId","translateWithIdSelection","titleText","useTitleInItem","invalid","invalidText","warn","warnText","helperText","label","hideLabel","id","name","inputRef","multiSelectRef","fieldRef","selectionRef","highlightedId"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MultiSelect', slots, ['default']);
    	let { items = [] } = $$props;
    	let { itemToString = item => item.text || item.id } = $$props;

    	let { itemToInput = item => {

    	} } = $$props;

    	let { selectedIds = [] } = $$props;
    	let { value = "" } = $$props;
    	let { size = undefined } = $$props;
    	let { type = "default" } = $$props;
    	let { direction = "bottom" } = $$props;
    	let { selectionFeedback = "top-after-reopen" } = $$props;
    	let { disabled = false } = $$props;
    	let { filterable = false } = $$props;
    	let { filterItem = (item, value) => item.text.toLowerCase().includes(value.trim().toLowerCase()) } = $$props;
    	let { open = false } = $$props;
    	let { light = false } = $$props;
    	let { locale = "en" } = $$props;
    	let { placeholder = "" } = $$props;
    	let { sortItem = (a, b) => a.text.localeCompare(b.text, locale, { numeric: true }) } = $$props;
    	let { translateWithId = undefined } = $$props;
    	let { translateWithIdSelection = undefined } = $$props;
    	let { titleText = "" } = $$props;
    	let { useTitleInItem = false } = $$props;
    	let { invalid = false } = $$props;
    	let { invalidText = "" } = $$props;
    	let { warn = false } = $$props;
    	let { warnText = "" } = $$props;
    	let { helperText = "" } = $$props;
    	let { label = "" } = $$props;
    	let { hideLabel = false } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { name = undefined } = $$props;
    	let { inputRef = null } = $$props;
    	let { multiSelectRef = null } = $$props;
    	let { fieldRef = null } = $$props;
    	let { selectionRef = null } = $$props;
    	let { highlightedId = null } = $$props;
    	const dispatch = createEventDispatcher();
    	let initialSorted = false;
    	let highlightedIndex = -1;
    	let prevChecked = [];

    	setContext("MultiSelect", {
    		declareRef: ({ key, ref }) => {
    			switch (key) {
    				case "field":
    					$$invalidate(4, fieldRef = ref);
    					break;
    				case "selection":
    					$$invalidate(5, selectionRef = ref);
    					break;
    			}
    		}
    	});

    	function change(direction) {
    		let index = highlightedIndex + direction;
    		const length = filterable ? filteredItems.length : items.length;
    		if (length === 0) return;

    		if (index < 0) {
    			index = length - 1;
    		} else if (index >= length) {
    			index = 0;
    		}

    		let disabled = items[index].disabled;

    		while (disabled) {
    			index = index + direction;

    			if (index < 0) {
    				index = items.length - 1;
    			} else if (index >= items.length) {
    				index = 0;
    			}

    			disabled = items[index].disabled;
    		}

    		$$invalidate(28, highlightedIndex = index);
    	}

    	function sort() {
    		return [
    			...checked.length > 1 ? checked.sort(sortItem) : checked,
    			...unchecked.sort(sortItem)
    		];
    	}

    	afterUpdate(() => {
    		if (checked.length !== prevChecked.length) {
    			if (selectionFeedback === "top") {
    				$$invalidate(29, sortedItems = sort());
    			}

    			prevChecked = checked;
    			$$invalidate(39, selectedIds = checked.map(({ id }) => id));

    			dispatch("select", {
    				selectedIds,
    				selected: checked,
    				unselected: unchecked
    			});
    		}

    		if (!open) {
    			if (!initialSorted || selectionFeedback !== "fixed") {
    				$$invalidate(29, sortedItems = sort());
    				initialSorted = true;
    			}

    			$$invalidate(28, highlightedIndex = -1);
    			$$invalidate(0, value = "");
    		}

    		$$invalidate(38, items = sortedItems);
    	});

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

    	const click_handler = ({ target }) => {
    		if (open && multiSelectRef && !multiSelectRef.contains(target)) {
    			$$invalidate(1, open = false);
    		}
    	};

    	function clear_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const clear_handler_1 = () => {
    		$$invalidate(29, sortedItems = sortedItems.map(item => ({ ...item, checked: false })));
    		if (fieldRef) fieldRef.blur();
    	};

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputRef = $$value;
    			$$invalidate(2, inputRef);
    		});
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	const keydown_handler_1 = ({ key }) => {
    		if (key === 'Enter') {
    			if (highlightedId) {
    				const filteredItemIndex = sortedItems.findIndex(item => item.id === highlightedId);

    				$$invalidate(29, sortedItems = sortedItems.map((item, i) => {
    					if (i !== filteredItemIndex) return item;
    					return { ...item, checked: !item.checked };
    				}));
    			}
    		} else if (key === 'Tab') {
    			$$invalidate(1, open = false);
    			inputRef.blur();
    		} else if (key === 'ArrowDown') {
    			change(1);
    		} else if (key === 'ArrowUp') {
    			change(-1);
    		} else if (key === 'Escape') {
    			$$invalidate(1, open = false);
    		} else if (key === ' ') {
    			if (!open) $$invalidate(1, open = true);
    		}
    	};

    	const clear_handler_2 = () => {
    		$$invalidate(0, value = '');
    		$$invalidate(1, open = false);
    	};

    	const click_handler_1 = e => {
    		e.stopPropagation();
    		$$invalidate(1, open = !open);
    	};

    	const click_handler_2 = () => {
    		if (disabled) return;

    		if (filterable) {
    			$$invalidate(1, open = true);
    			inputRef.focus();
    		} else {
    			$$invalidate(1, open = !open);
    		}
    	};

    	const keydown_handler_2 = e => {
    		if (filterable) {
    			return;
    		}

    		const key = e.key;

    		if ([' ', 'ArrowUp', 'ArrowDown'].includes(key)) {
    			e.preventDefault();
    		}

    		if (key === ' ') {
    			$$invalidate(1, open = !open);
    		} else if (key === 'Tab') {
    			if (selectionRef && checked.length > 0) {
    				selectionRef.focus();
    			} else {
    				$$invalidate(1, open = false);
    				fieldRef.blur();
    			}
    		} else if (key === 'ArrowDown') {
    			change(1);
    		} else if (key === 'ArrowUp') {
    			change(-1);
    		} else if (key === 'Enter') {
    			if (highlightedIndex > -1) {
    				$$invalidate(29, sortedItems = sortedItems.map((item, i) => {
    					if (i !== highlightedIndex) return item;
    					return { ...item, checked: !item.checked };
    				}));
    			}
    		} else if (key === 'Escape') {
    			$$invalidate(1, open = false);
    		}
    	};

    	const focus_handler_1 = () => {
    		if (filterable) {
    			$$invalidate(1, open = true);
    			if (inputRef) inputRef.focus();
    		}
    	};

    	const blur_handler_1 = e => {
    		if (!filterable) dispatch('blur', e);
    	};

    	const blur_handler_2 = i => {
    		if (i === filteredItems.length - 1) $$invalidate(1, open = false);
    	};

    	const click_handler_3 = (item, e) => {
    		if (item.disabled) {
    			e.stopPropagation();
    			return;
    		}

    		$$invalidate(29, sortedItems = sortedItems.map(_ => _.id === item.id ? { ..._, checked: !_.checked } : _));
    		fieldRef.focus();
    	};

    	const mouseenter_handler = (item, i) => {
    		if (item.disabled) return;
    		$$invalidate(28, highlightedIndex = i);
    	};

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			multiSelectRef = $$value;
    			$$invalidate(3, multiSelectRef);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(72, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(37, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('items' in $$new_props) $$invalidate(38, items = $$new_props.items);
    		if ('itemToString' in $$new_props) $$invalidate(7, itemToString = $$new_props.itemToString);
    		if ('itemToInput' in $$new_props) $$invalidate(8, itemToInput = $$new_props.itemToInput);
    		if ('selectedIds' in $$new_props) $$invalidate(39, selectedIds = $$new_props.selectedIds);
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('size' in $$new_props) $$invalidate(9, size = $$new_props.size);
    		if ('type' in $$new_props) $$invalidate(40, type = $$new_props.type);
    		if ('direction' in $$new_props) $$invalidate(10, direction = $$new_props.direction);
    		if ('selectionFeedback' in $$new_props) $$invalidate(41, selectionFeedback = $$new_props.selectionFeedback);
    		if ('disabled' in $$new_props) $$invalidate(11, disabled = $$new_props.disabled);
    		if ('filterable' in $$new_props) $$invalidate(12, filterable = $$new_props.filterable);
    		if ('filterItem' in $$new_props) $$invalidate(42, filterItem = $$new_props.filterItem);
    		if ('open' in $$new_props) $$invalidate(1, open = $$new_props.open);
    		if ('light' in $$new_props) $$invalidate(13, light = $$new_props.light);
    		if ('locale' in $$new_props) $$invalidate(43, locale = $$new_props.locale);
    		if ('placeholder' in $$new_props) $$invalidate(14, placeholder = $$new_props.placeholder);
    		if ('sortItem' in $$new_props) $$invalidate(44, sortItem = $$new_props.sortItem);
    		if ('translateWithId' in $$new_props) $$invalidate(15, translateWithId = $$new_props.translateWithId);
    		if ('translateWithIdSelection' in $$new_props) $$invalidate(16, translateWithIdSelection = $$new_props.translateWithIdSelection);
    		if ('titleText' in $$new_props) $$invalidate(17, titleText = $$new_props.titleText);
    		if ('useTitleInItem' in $$new_props) $$invalidate(18, useTitleInItem = $$new_props.useTitleInItem);
    		if ('invalid' in $$new_props) $$invalidate(19, invalid = $$new_props.invalid);
    		if ('invalidText' in $$new_props) $$invalidate(20, invalidText = $$new_props.invalidText);
    		if ('warn' in $$new_props) $$invalidate(21, warn = $$new_props.warn);
    		if ('warnText' in $$new_props) $$invalidate(22, warnText = $$new_props.warnText);
    		if ('helperText' in $$new_props) $$invalidate(23, helperText = $$new_props.helperText);
    		if ('label' in $$new_props) $$invalidate(24, label = $$new_props.label);
    		if ('hideLabel' in $$new_props) $$invalidate(25, hideLabel = $$new_props.hideLabel);
    		if ('id' in $$new_props) $$invalidate(26, id = $$new_props.id);
    		if ('name' in $$new_props) $$invalidate(27, name = $$new_props.name);
    		if ('inputRef' in $$new_props) $$invalidate(2, inputRef = $$new_props.inputRef);
    		if ('multiSelectRef' in $$new_props) $$invalidate(3, multiSelectRef = $$new_props.multiSelectRef);
    		if ('fieldRef' in $$new_props) $$invalidate(4, fieldRef = $$new_props.fieldRef);
    		if ('selectionRef' in $$new_props) $$invalidate(5, selectionRef = $$new_props.selectionRef);
    		if ('highlightedId' in $$new_props) $$invalidate(6, highlightedId = $$new_props.highlightedId);
    		if ('$$scope' in $$new_props) $$invalidate(67, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		items,
    		itemToString,
    		itemToInput,
    		selectedIds,
    		value,
    		size,
    		type,
    		direction,
    		selectionFeedback,
    		disabled,
    		filterable,
    		filterItem,
    		open,
    		light,
    		locale,
    		placeholder,
    		sortItem,
    		translateWithId,
    		translateWithIdSelection,
    		titleText,
    		useTitleInItem,
    		invalid,
    		invalidText,
    		warn,
    		warnText,
    		helperText,
    		label,
    		hideLabel,
    		id,
    		name,
    		inputRef,
    		multiSelectRef,
    		fieldRef,
    		selectionRef,
    		highlightedId,
    		afterUpdate,
    		createEventDispatcher,
    		setContext,
    		WarningFilled: WarningFilled$1,
    		WarningAltFilled: WarningAltFilled$1,
    		Checkbox: Checkbox$1,
    		ListBox: ListBox$1,
    		ListBoxField: ListBoxField$1,
    		ListBoxMenu: ListBoxMenu$1,
    		ListBoxMenuIcon: ListBoxMenuIcon$1,
    		ListBoxMenuItem: ListBoxMenuItem$1,
    		ListBoxSelection: ListBoxSelection$1,
    		dispatch,
    		initialSorted,
    		highlightedIndex,
    		prevChecked,
    		change,
    		sort,
    		sortedItems,
    		filteredItems,
    		unchecked,
    		checked,
    		ariaLabel,
    		inline,
    		menuId
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(72, $$props = assign(assign({}, $$props), $$new_props));
    		if ('items' in $$props) $$invalidate(38, items = $$new_props.items);
    		if ('itemToString' in $$props) $$invalidate(7, itemToString = $$new_props.itemToString);
    		if ('itemToInput' in $$props) $$invalidate(8, itemToInput = $$new_props.itemToInput);
    		if ('selectedIds' in $$props) $$invalidate(39, selectedIds = $$new_props.selectedIds);
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('size' in $$props) $$invalidate(9, size = $$new_props.size);
    		if ('type' in $$props) $$invalidate(40, type = $$new_props.type);
    		if ('direction' in $$props) $$invalidate(10, direction = $$new_props.direction);
    		if ('selectionFeedback' in $$props) $$invalidate(41, selectionFeedback = $$new_props.selectionFeedback);
    		if ('disabled' in $$props) $$invalidate(11, disabled = $$new_props.disabled);
    		if ('filterable' in $$props) $$invalidate(12, filterable = $$new_props.filterable);
    		if ('filterItem' in $$props) $$invalidate(42, filterItem = $$new_props.filterItem);
    		if ('open' in $$props) $$invalidate(1, open = $$new_props.open);
    		if ('light' in $$props) $$invalidate(13, light = $$new_props.light);
    		if ('locale' in $$props) $$invalidate(43, locale = $$new_props.locale);
    		if ('placeholder' in $$props) $$invalidate(14, placeholder = $$new_props.placeholder);
    		if ('sortItem' in $$props) $$invalidate(44, sortItem = $$new_props.sortItem);
    		if ('translateWithId' in $$props) $$invalidate(15, translateWithId = $$new_props.translateWithId);
    		if ('translateWithIdSelection' in $$props) $$invalidate(16, translateWithIdSelection = $$new_props.translateWithIdSelection);
    		if ('titleText' in $$props) $$invalidate(17, titleText = $$new_props.titleText);
    		if ('useTitleInItem' in $$props) $$invalidate(18, useTitleInItem = $$new_props.useTitleInItem);
    		if ('invalid' in $$props) $$invalidate(19, invalid = $$new_props.invalid);
    		if ('invalidText' in $$props) $$invalidate(20, invalidText = $$new_props.invalidText);
    		if ('warn' in $$props) $$invalidate(21, warn = $$new_props.warn);
    		if ('warnText' in $$props) $$invalidate(22, warnText = $$new_props.warnText);
    		if ('helperText' in $$props) $$invalidate(23, helperText = $$new_props.helperText);
    		if ('label' in $$props) $$invalidate(24, label = $$new_props.label);
    		if ('hideLabel' in $$props) $$invalidate(25, hideLabel = $$new_props.hideLabel);
    		if ('id' in $$props) $$invalidate(26, id = $$new_props.id);
    		if ('name' in $$props) $$invalidate(27, name = $$new_props.name);
    		if ('inputRef' in $$props) $$invalidate(2, inputRef = $$new_props.inputRef);
    		if ('multiSelectRef' in $$props) $$invalidate(3, multiSelectRef = $$new_props.multiSelectRef);
    		if ('fieldRef' in $$props) $$invalidate(4, fieldRef = $$new_props.fieldRef);
    		if ('selectionRef' in $$props) $$invalidate(5, selectionRef = $$new_props.selectionRef);
    		if ('highlightedId' in $$props) $$invalidate(6, highlightedId = $$new_props.highlightedId);
    		if ('initialSorted' in $$props) initialSorted = $$new_props.initialSorted;
    		if ('highlightedIndex' in $$props) $$invalidate(28, highlightedIndex = $$new_props.highlightedIndex);
    		if ('prevChecked' in $$props) prevChecked = $$new_props.prevChecked;
    		if ('sortedItems' in $$props) $$invalidate(29, sortedItems = $$new_props.sortedItems);
    		if ('filteredItems' in $$props) $$invalidate(30, filteredItems = $$new_props.filteredItems);
    		if ('unchecked' in $$props) unchecked = $$new_props.unchecked;
    		if ('checked' in $$props) $$invalidate(31, checked = $$new_props.checked);
    		if ('ariaLabel' in $$props) $$invalidate(32, ariaLabel = $$new_props.ariaLabel);
    		if ('inline' in $$props) $$invalidate(33, inline = $$new_props.inline);
    		if ('menuId' in $$props) $$invalidate(34, menuId = $$new_props.menuId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*id*/ 67108864) {
    			$$invalidate(34, menuId = `menu-${id}`);
    		}

    		if ($$self.$$.dirty[1] & /*type*/ 512) {
    			$$invalidate(33, inline = type === "inline");
    		}

    		$$invalidate(32, ariaLabel = $$props["aria-label"] || "Choose an item");

    		if ($$self.$$.dirty[1] & /*items, selectedIds*/ 384) {
    			$$invalidate(29, sortedItems = items.map(item => ({
    				...item,
    				checked: selectedIds.includes(item.id)
    			})));
    		}

    		if ($$self.$$.dirty[0] & /*sortedItems*/ 536870912) {
    			$$invalidate(31, checked = sortedItems.filter(({ checked }) => checked));
    		}

    		if ($$self.$$.dirty[0] & /*sortedItems*/ 536870912) {
    			unchecked = sortedItems.filter(({ checked }) => !checked);
    		}

    		if ($$self.$$.dirty[0] & /*sortedItems, value*/ 536870913 | $$self.$$.dirty[1] & /*filterItem*/ 2048) {
    			$$invalidate(30, filteredItems = sortedItems.filter(item => filterItem(item, value)));
    		}

    		if ($$self.$$.dirty[0] & /*highlightedIndex, filterable, filteredItems, sortedItems*/ 1879052288) {
    			$$invalidate(6, highlightedId = highlightedIndex > -1
    			? (filterable ? filteredItems : sortedItems)[highlightedIndex]?.id ?? null
    			: null);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		value,
    		open,
    		inputRef,
    		multiSelectRef,
    		fieldRef,
    		selectionRef,
    		highlightedId,
    		itemToString,
    		itemToInput,
    		size,
    		direction,
    		disabled,
    		filterable,
    		light,
    		placeholder,
    		translateWithId,
    		translateWithIdSelection,
    		titleText,
    		useTitleInItem,
    		invalid,
    		invalidText,
    		warn,
    		warnText,
    		helperText,
    		label,
    		hideLabel,
    		id,
    		name,
    		highlightedIndex,
    		sortedItems,
    		filteredItems,
    		checked,
    		ariaLabel,
    		inline,
    		menuId,
    		dispatch,
    		change,
    		$$restProps,
    		items,
    		selectedIds,
    		type,
    		selectionFeedback,
    		filterItem,
    		locale,
    		sortItem,
    		slots,
    		keydown_handler,
    		keyup_handler,
    		focus_handler,
    		blur_handler,
    		paste_handler,
    		click_handler,
    		clear_handler,
    		clear_handler_1,
    		input_binding,
    		input_input_handler,
    		keydown_handler_1,
    		clear_handler_2,
    		click_handler_1,
    		click_handler_2,
    		keydown_handler_2,
    		focus_handler_1,
    		blur_handler_1,
    		blur_handler_2,
    		click_handler_3,
    		mouseenter_handler,
    		div_binding,
    		$$scope
    	];
    }

    class MultiSelect extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$6,
    			create_fragment$6,
    			safe_not_equal,
    			{
    				items: 38,
    				itemToString: 7,
    				itemToInput: 8,
    				selectedIds: 39,
    				value: 0,
    				size: 9,
    				type: 40,
    				direction: 10,
    				selectionFeedback: 41,
    				disabled: 11,
    				filterable: 12,
    				filterItem: 42,
    				open: 1,
    				light: 13,
    				locale: 43,
    				placeholder: 14,
    				sortItem: 44,
    				translateWithId: 15,
    				translateWithIdSelection: 16,
    				titleText: 17,
    				useTitleInItem: 18,
    				invalid: 19,
    				invalidText: 20,
    				warn: 21,
    				warnText: 22,
    				helperText: 23,
    				label: 24,
    				hideLabel: 25,
    				id: 26,
    				name: 27,
    				inputRef: 2,
    				multiSelectRef: 3,
    				fieldRef: 4,
    				selectionRef: 5,
    				highlightedId: 6
    			},
    			null,
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MultiSelect",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get items() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemToString() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemToString(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemToInput() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemToInput(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedIds() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedIds(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get direction() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectionFeedback() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectionFeedback(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filterable() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filterable(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filterItem() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filterItem(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get locale() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set locale(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sortItem() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortItem(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translateWithId() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set translateWithId(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translateWithIdSelection() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set translateWithIdSelection(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleText() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleText(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get useTitleInItem() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set useTitleInItem(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalidText() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalidText(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warn() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warn(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warnText() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warnText(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperText() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperText(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideLabel() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideLabel(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputRef() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputRef(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiSelectRef() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiSelectRef(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fieldRef() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fieldRef(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectionRef() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectionRef(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get highlightedId() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set highlightedId(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var MultiSelect$1 = MultiSelect;

    /* node_modules/carbon-components-svelte/src/ProgressBar/ProgressBar.svelte generated by Svelte v3.55.1 */
    const file$5 = "node_modules/carbon-components-svelte/src/ProgressBar/ProgressBar.svelte";
    const get_labelText_slot_changes$1 = dirty => ({});
    const get_labelText_slot_context$1 = ctx => ({});

    // (80:27)
    function fallback_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*labelText*/ ctx[4]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*labelText*/ 16) set_data_dev(t, /*labelText*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$2.name,
    		type: "fallback",
    		source: "(80:27)        ",
    		ctx
    	});

    	return block;
    }

    // (83:4) {#if status === "error" || status === "finished"}
    function create_if_block_1$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*statusIcons*/ ctx[10][/*status*/ ctx[2]];

    	function switch_props(ctx) {
    		return {
    			props: { class: "bx--progress-bar__status-icon" },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
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
    			if (switch_value !== (switch_value = /*statusIcons*/ ctx[10][/*status*/ ctx[2]])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
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
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(83:4) {#if status === \\\"error\\\" || status === \\\"finished\\\"}",
    		ctx
    	});

    	return block;
    }

    // (105:2) {#if helperText}
    function create_if_block$2(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*helperText*/ ctx[6]);
    			attr_dev(div, "id", /*helperId*/ ctx[11]);
    			toggle_class(div, "bx--progress-bar__helper-text", true);
    			add_location(div, file$5, 105, 4, 2655);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*helperText*/ 64) set_data_dev(t, /*helperText*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(105:2) {#if helperText}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div2;
    	let label;
    	let t0;
    	let t1;
    	let div1;
    	let div0;
    	let div1_aria_busy_value;
    	let div1_aria_valuemin_value;
    	let div1_aria_valuemax_value;
    	let div1_aria_valuenow_value;
    	let div1_aria_describedby_value;
    	let t2;
    	let current;
    	const labelText_slot_template = /*#slots*/ ctx[15].labelText;
    	const labelText_slot = create_slot(labelText_slot_template, ctx, /*$$scope*/ ctx[14], get_labelText_slot_context$1);
    	const labelText_slot_or_fallback = labelText_slot || fallback_block$2(ctx);
    	let if_block0 = (/*status*/ ctx[2] === "error" || /*status*/ ctx[2] === "finished") && create_if_block_1$1(ctx);
    	let if_block1 = /*helperText*/ ctx[6] && create_if_block$2(ctx);
    	let div2_levels = [/*$$restProps*/ ctx[12]];
    	let div2_data = {};

    	for (let i = 0; i < div2_levels.length; i += 1) {
    		div2_data = assign(div2_data, div2_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			label = element("label");
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.c();
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			t2 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(label, "for", /*id*/ ctx[7]);
    			toggle_class(label, "bx--progress-bar__label", true);
    			toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[5]);
    			add_location(label, file$5, 74, 2, 1776);
    			toggle_class(div0, "bx--progress-bar__bar", true);
    			set_style(div0, "transform", /*status*/ ctx[2] === "active" && `scaleX(${/*capped*/ ctx[8] / /*max*/ ctx[0]})`);
    			add_location(div0, file$5, 99, 4, 2488);
    			attr_dev(div1, "role", "progressbar");
    			attr_dev(div1, "id", /*id*/ ctx[7]);
    			attr_dev(div1, "aria-busy", div1_aria_busy_value = /*status*/ ctx[2] === 'active');
    			attr_dev(div1, "aria-valuemin", div1_aria_valuemin_value = /*indeterminate*/ ctx[9] ? undefined : 0);
    			attr_dev(div1, "aria-valuemax", div1_aria_valuemax_value = /*indeterminate*/ ctx[9] ? undefined : /*max*/ ctx[0]);
    			attr_dev(div1, "aria-valuenow", div1_aria_valuenow_value = /*indeterminate*/ ctx[9] ? undefined : /*capped*/ ctx[8]);
    			attr_dev(div1, "aria-describedby", div1_aria_describedby_value = /*helperText*/ ctx[6] ? /*helperId*/ ctx[11] : null);
    			toggle_class(div1, "bx--progress-bar__track", true);
    			add_location(div1, file$5, 89, 2, 2140);
    			set_attributes(div2, div2_data);
    			toggle_class(div2, "bx--progress-bar", true);
    			toggle_class(div2, "bx--progress-bar--indeterminate", /*indeterminate*/ ctx[9]);
    			toggle_class(div2, "bx--progress-bar--big", /*size*/ ctx[3] === 'md');
    			toggle_class(div2, "bx--progress-bar--small", /*size*/ ctx[3] === 'sm');
    			toggle_class(div2, "bx--progress-bar--inline", /*kind*/ ctx[1] === 'inline');
    			toggle_class(div2, "bx--progress-bar--indented", /*kind*/ ctx[1] === 'indented');
    			toggle_class(div2, "bx--progress-bar--error", /*status*/ ctx[2] === 'error');
    			toggle_class(div2, "bx--progress-bar--finished", /*status*/ ctx[2] === 'finished');
    			add_location(div2, file$5, 63, 0, 1328);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, label);

    			if (labelText_slot_or_fallback) {
    				labelText_slot_or_fallback.m(label, null);
    			}

    			append_dev(label, t0);
    			if (if_block0) if_block0.m(label, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div2, t2);
    			if (if_block1) if_block1.m(div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (labelText_slot) {
    				if (labelText_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						labelText_slot,
    						labelText_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(labelText_slot_template, /*$$scope*/ ctx[14], dirty, get_labelText_slot_changes$1),
    						get_labelText_slot_context$1
    					);
    				}
    			} else {
    				if (labelText_slot_or_fallback && labelText_slot_or_fallback.p && (!current || dirty & /*labelText*/ 16)) {
    					labelText_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			if (/*status*/ ctx[2] === "error" || /*status*/ ctx[2] === "finished") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*status*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(label, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*id*/ 128) {
    				attr_dev(label, "for", /*id*/ ctx[7]);
    			}

    			if (!current || dirty & /*hideLabel*/ 32) {
    				toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[5]);
    			}

    			if (dirty & /*status, capped, max*/ 261) {
    				set_style(div0, "transform", /*status*/ ctx[2] === "active" && `scaleX(${/*capped*/ ctx[8] / /*max*/ ctx[0]})`);
    			}

    			if (!current || dirty & /*id*/ 128) {
    				attr_dev(div1, "id", /*id*/ ctx[7]);
    			}

    			if (!current || dirty & /*status*/ 4 && div1_aria_busy_value !== (div1_aria_busy_value = /*status*/ ctx[2] === 'active')) {
    				attr_dev(div1, "aria-busy", div1_aria_busy_value);
    			}

    			if (!current || dirty & /*indeterminate*/ 512 && div1_aria_valuemin_value !== (div1_aria_valuemin_value = /*indeterminate*/ ctx[9] ? undefined : 0)) {
    				attr_dev(div1, "aria-valuemin", div1_aria_valuemin_value);
    			}

    			if (!current || dirty & /*indeterminate, max*/ 513 && div1_aria_valuemax_value !== (div1_aria_valuemax_value = /*indeterminate*/ ctx[9] ? undefined : /*max*/ ctx[0])) {
    				attr_dev(div1, "aria-valuemax", div1_aria_valuemax_value);
    			}

    			if (!current || dirty & /*indeterminate, capped*/ 768 && div1_aria_valuenow_value !== (div1_aria_valuenow_value = /*indeterminate*/ ctx[9] ? undefined : /*capped*/ ctx[8])) {
    				attr_dev(div1, "aria-valuenow", div1_aria_valuenow_value);
    			}

    			if (!current || dirty & /*helperText*/ 64 && div1_aria_describedby_value !== (div1_aria_describedby_value = /*helperText*/ ctx[6] ? /*helperId*/ ctx[11] : null)) {
    				attr_dev(div1, "aria-describedby", div1_aria_describedby_value);
    			}

    			if (/*helperText*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					if_block1.m(div2, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			set_attributes(div2, div2_data = get_spread_update(div2_levels, [dirty & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12]]));
    			toggle_class(div2, "bx--progress-bar", true);
    			toggle_class(div2, "bx--progress-bar--indeterminate", /*indeterminate*/ ctx[9]);
    			toggle_class(div2, "bx--progress-bar--big", /*size*/ ctx[3] === 'md');
    			toggle_class(div2, "bx--progress-bar--small", /*size*/ ctx[3] === 'sm');
    			toggle_class(div2, "bx--progress-bar--inline", /*kind*/ ctx[1] === 'inline');
    			toggle_class(div2, "bx--progress-bar--indented", /*kind*/ ctx[1] === 'indented');
    			toggle_class(div2, "bx--progress-bar--error", /*status*/ ctx[2] === 'error');
    			toggle_class(div2, "bx--progress-bar--finished", /*status*/ ctx[2] === 'finished');
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(labelText_slot_or_fallback, local);
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(labelText_slot_or_fallback, local);
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.d(detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
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
    	let indeterminate;
    	const omit_props_names = ["value","max","kind","status","size","labelText","hideLabel","helperText","id"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProgressBar', slots, ['labelText']);
    	let { value = undefined } = $$props;
    	let { max = 100 } = $$props;
    	let { kind = "default" } = $$props;
    	let { status = "active" } = $$props;
    	let { size = "md" } = $$props;
    	let { labelText = "" } = $$props;
    	let { hideLabel = false } = $$props;
    	let { helperText = "" } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;

    	const statusIcons = {
    		error: ErrorFilled$1,
    		finished: CheckmarkFilled$1
    	};

    	let helperId = "ccs-" + Math.random().toString(36);
    	let capped;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('value' in $$new_props) $$invalidate(13, value = $$new_props.value);
    		if ('max' in $$new_props) $$invalidate(0, max = $$new_props.max);
    		if ('kind' in $$new_props) $$invalidate(1, kind = $$new_props.kind);
    		if ('status' in $$new_props) $$invalidate(2, status = $$new_props.status);
    		if ('size' in $$new_props) $$invalidate(3, size = $$new_props.size);
    		if ('labelText' in $$new_props) $$invalidate(4, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$new_props) $$invalidate(5, hideLabel = $$new_props.hideLabel);
    		if ('helperText' in $$new_props) $$invalidate(6, helperText = $$new_props.helperText);
    		if ('id' in $$new_props) $$invalidate(7, id = $$new_props.id);
    		if ('$$scope' in $$new_props) $$invalidate(14, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		value,
    		max,
    		kind,
    		status,
    		size,
    		labelText,
    		hideLabel,
    		helperText,
    		id,
    		CheckmarkFilled: CheckmarkFilled$1,
    		ErrorFilled: ErrorFilled$1,
    		statusIcons,
    		helperId,
    		capped,
    		indeterminate
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('value' in $$props) $$invalidate(13, value = $$new_props.value);
    		if ('max' in $$props) $$invalidate(0, max = $$new_props.max);
    		if ('kind' in $$props) $$invalidate(1, kind = $$new_props.kind);
    		if ('status' in $$props) $$invalidate(2, status = $$new_props.status);
    		if ('size' in $$props) $$invalidate(3, size = $$new_props.size);
    		if ('labelText' in $$props) $$invalidate(4, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$props) $$invalidate(5, hideLabel = $$new_props.hideLabel);
    		if ('helperText' in $$props) $$invalidate(6, helperText = $$new_props.helperText);
    		if ('id' in $$props) $$invalidate(7, id = $$new_props.id);
    		if ('helperId' in $$props) $$invalidate(11, helperId = $$new_props.helperId);
    		if ('capped' in $$props) $$invalidate(8, capped = $$new_props.capped);
    		if ('indeterminate' in $$props) $$invalidate(9, indeterminate = $$new_props.indeterminate);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value, status*/ 8196) {
    			$$invalidate(9, indeterminate = value === undefined && status === "active");
    		}

    		if ($$self.$$.dirty & /*status, value, max*/ 8197) {
    			{
    				if (status === "error" || value < 0) {
    					$$invalidate(8, capped = 0);
    				} else if (value > max) {
    					$$invalidate(8, capped = max);
    				} else {
    					$$invalidate(8, capped = value);
    				}
    			}
    		}
    	};

    	return [
    		max,
    		kind,
    		status,
    		size,
    		labelText,
    		hideLabel,
    		helperText,
    		id,
    		capped,
    		indeterminate,
    		statusIcons,
    		helperId,
    		$$restProps,
    		value,
    		$$scope,
    		slots
    	];
    }

    class ProgressBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			value: 13,
    			max: 0,
    			kind: 1,
    			status: 2,
    			size: 3,
    			labelText: 4,
    			hideLabel: 5,
    			helperText: 6,
    			id: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProgressBar",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get value() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get kind() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kind(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get status() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set status(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelText() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelText(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideLabel() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideLabel(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperText() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperText(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ProgressBar$1 = ProgressBar;

    /* node_modules/carbon-components-svelte/src/TextArea/TextArea.svelte generated by Svelte v3.55.1 */
    const file$4 = "node_modules/carbon-components-svelte/src/TextArea/TextArea.svelte";
    const get_labelText_slot_changes = dirty => ({});
    const get_labelText_slot_context = ctx => ({});

    // (70:2) {#if (labelText || $$slots.labelText) && !hideLabel}
    function create_if_block_3(ctx) {
    	let div;
    	let label;
    	let t;
    	let current;
    	const labelText_slot_template = /*#slots*/ ctx[20].labelText;
    	const labelText_slot = create_slot(labelText_slot_template, ctx, /*$$scope*/ ctx[19], get_labelText_slot_context);
    	const labelText_slot_or_fallback = labelText_slot || fallback_block$1(ctx);
    	let if_block = /*maxCount*/ ctx[5] && create_if_block_4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.c();
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(label, "for", /*id*/ ctx[14]);
    			toggle_class(label, "bx--label", true);
    			toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[11]);
    			toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[7]);
    			add_location(label, file$4, 71, 6, 1703);
    			toggle_class(div, "bx--text-area__label-wrapper", true);
    			add_location(div, file$4, 70, 4, 1647);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);

    			if (labelText_slot_or_fallback) {
    				labelText_slot_or_fallback.m(label, null);
    			}

    			append_dev(div, t);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (labelText_slot) {
    				if (labelText_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						labelText_slot,
    						labelText_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(labelText_slot_template, /*$$scope*/ ctx[19], dirty, get_labelText_slot_changes),
    						get_labelText_slot_context
    					);
    				}
    			} else {
    				if (labelText_slot_or_fallback && labelText_slot_or_fallback.p && (!current || dirty[0] & /*labelText*/ 1024)) {
    					labelText_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*id*/ 16384) {
    				attr_dev(label, "for", /*id*/ ctx[14]);
    			}

    			if (!current || dirty[0] & /*hideLabel*/ 2048) {
    				toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[11]);
    			}

    			if (!current || dirty[0] & /*disabled*/ 128) {
    				toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[7]);
    			}

    			if (/*maxCount*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
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
    			if (detaching) detach_dev(div);
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.d(detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(70:2) {#if (labelText || $$slots.labelText) && !hideLabel}",
    		ctx
    	});

    	return block;
    }

    // (78:31)
    function fallback_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*labelText*/ ctx[10]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*labelText*/ 1024) set_data_dev(t, /*labelText*/ ctx[10]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(78:31)            ",
    		ctx
    	});

    	return block;
    }

    // (82:6) {#if maxCount}
    function create_if_block_4(ctx) {
    	let div;
    	let t0_value = /*value*/ ctx[0].length + "";
    	let t0;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = text("/");
    			t2 = text(/*maxCount*/ ctx[5]);
    			toggle_class(div, "bx--label", true);
    			toggle_class(div, "bx--label--disabled", /*disabled*/ ctx[7]);
    			add_location(div, file$4, 82, 8, 1979);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*value*/ 1 && t0_value !== (t0_value = /*value*/ ctx[0].length + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*maxCount*/ 32) set_data_dev(t2, /*maxCount*/ ctx[5]);

    			if (dirty[0] & /*disabled*/ 128) {
    				toggle_class(div, "bx--label--disabled", /*disabled*/ ctx[7]);
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
    		source: "(82:6) {#if maxCount}",
    		ctx
    	});

    	return block;
    }

    // (93:4) {#if invalid}
    function create_if_block_2(ctx) {
    	let warningfilled;
    	let current;

    	warningfilled = new WarningFilled$1({
    			props: { class: "bx--text-area__invalid-icon" },
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
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(93:4) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (121:2) {#if !invalid && helperText}
    function create_if_block_1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*helperText*/ ctx[9]);
    			toggle_class(div, "bx--form__helper-text", true);
    			toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[7]);
    			add_location(div, file$4, 121, 4, 2989);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*helperText*/ 512) set_data_dev(t, /*helperText*/ ctx[9]);

    			if (dirty[0] & /*disabled*/ 128) {
    				toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[7]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(121:2) {#if !invalid && helperText}",
    		ctx
    	});

    	return block;
    }

    // (129:2) {#if invalid}
    function create_if_block$1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*invalidText*/ ctx[13]);
    			attr_dev(div, "id", /*errorId*/ ctx[16]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$4, 129, 4, 3158);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*invalidText*/ 8192) set_data_dev(t, /*invalidText*/ ctx[13]);

    			if (dirty[0] & /*errorId*/ 65536) {
    				attr_dev(div, "id", /*errorId*/ ctx[16]);
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
    		source: "(129:2) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let t1;
    	let textarea;
    	let textarea_aria_invalid_value;
    	let textarea_aria_describedby_value;
    	let textarea_maxlength_value;
    	let div0_data_invalid_value;
    	let t2;
    	let t3;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = (/*labelText*/ ctx[10] || /*$$slots*/ ctx[17].labelText) && !/*hideLabel*/ ctx[11] && create_if_block_3(ctx);
    	let if_block1 = /*invalid*/ ctx[12] && create_if_block_2(ctx);

    	let textarea_levels = [
    		{
    			"aria-invalid": textarea_aria_invalid_value = /*invalid*/ ctx[12] || undefined
    		},
    		{
    			"aria-describedby": textarea_aria_describedby_value = /*invalid*/ ctx[12] ? /*errorId*/ ctx[16] : undefined
    		},
    		{ disabled: /*disabled*/ ctx[7] },
    		{ id: /*id*/ ctx[14] },
    		{ name: /*name*/ ctx[15] },
    		{ cols: /*cols*/ ctx[3] },
    		{ rows: /*rows*/ ctx[4] },
    		{ placeholder: /*placeholder*/ ctx[2] },
    		{ readOnly: /*readonly*/ ctx[8] },
    		{
    			maxlength: textarea_maxlength_value = /*maxCount*/ ctx[5] ?? undefined
    		},
    		/*$$restProps*/ ctx[18]
    	];

    	let textarea_data = {};

    	for (let i = 0; i < textarea_levels.length; i += 1) {
    		textarea_data = assign(textarea_data, textarea_levels[i]);
    	}

    	let if_block2 = !/*invalid*/ ctx[12] && /*helperText*/ ctx[9] && create_if_block_1(ctx);
    	let if_block3 = /*invalid*/ ctx[12] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div0 = element("div");
    			if (if_block1) if_block1.c();
    			t1 = space();
    			textarea = element("textarea");
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			if (if_block3) if_block3.c();
    			set_attributes(textarea, textarea_data);
    			toggle_class(textarea, "bx--text-area", true);
    			toggle_class(textarea, "bx--text-area--light", /*light*/ ctx[6]);
    			toggle_class(textarea, "bx--text-area--invalid", /*invalid*/ ctx[12]);
    			add_location(textarea, file$4, 95, 4, 2318);
    			attr_dev(div0, "data-invalid", div0_data_invalid_value = /*invalid*/ ctx[12] || undefined);
    			toggle_class(div0, "bx--text-area__wrapper", true);
    			add_location(div0, file$4, 88, 2, 2133);
    			toggle_class(div1, "bx--form-item", true);
    			add_location(div1, file$4, 62, 0, 1492);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t1);
    			append_dev(div0, textarea);
    			if (textarea.autofocus) textarea.focus();
    			/*textarea_binding*/ ctx[32](textarea);
    			set_input_value(textarea, /*value*/ ctx[0]);
    			append_dev(div1, t2);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div1, t3);
    			if (if_block3) if_block3.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[33]),
    					listen_dev(textarea, "change", /*change_handler*/ ctx[25], false, false, false),
    					listen_dev(textarea, "input", /*input_handler*/ ctx[26], false, false, false),
    					listen_dev(textarea, "keydown", /*keydown_handler*/ ctx[27], false, false, false),
    					listen_dev(textarea, "keyup", /*keyup_handler*/ ctx[28], false, false, false),
    					listen_dev(textarea, "focus", /*focus_handler*/ ctx[29], false, false, false),
    					listen_dev(textarea, "blur", /*blur_handler*/ ctx[30], false, false, false),
    					listen_dev(textarea, "paste", /*paste_handler*/ ctx[31], false, false, false),
    					listen_dev(div1, "click", /*click_handler*/ ctx[21], false, false, false),
    					listen_dev(div1, "mouseover", /*mouseover_handler*/ ctx[22], false, false, false),
    					listen_dev(div1, "mouseenter", /*mouseenter_handler*/ ctx[23], false, false, false),
    					listen_dev(div1, "mouseleave", /*mouseleave_handler*/ ctx[24], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((/*labelText*/ ctx[10] || /*$$slots*/ ctx[17].labelText) && !/*hideLabel*/ ctx[11]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*labelText, $$slots, hideLabel*/ 134144) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
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

    			if (/*invalid*/ ctx[12]) {
    				if (if_block1) {
    					if (dirty[0] & /*invalid*/ 4096) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2(ctx);
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

    			set_attributes(textarea, textarea_data = get_spread_update(textarea_levels, [
    				(!current || dirty[0] & /*invalid*/ 4096 && textarea_aria_invalid_value !== (textarea_aria_invalid_value = /*invalid*/ ctx[12] || undefined)) && {
    					"aria-invalid": textarea_aria_invalid_value
    				},
    				(!current || dirty[0] & /*invalid, errorId*/ 69632 && textarea_aria_describedby_value !== (textarea_aria_describedby_value = /*invalid*/ ctx[12] ? /*errorId*/ ctx[16] : undefined)) && {
    					"aria-describedby": textarea_aria_describedby_value
    				},
    				(!current || dirty[0] & /*disabled*/ 128) && { disabled: /*disabled*/ ctx[7] },
    				(!current || dirty[0] & /*id*/ 16384) && { id: /*id*/ ctx[14] },
    				(!current || dirty[0] & /*name*/ 32768) && { name: /*name*/ ctx[15] },
    				(!current || dirty[0] & /*cols*/ 8) && { cols: /*cols*/ ctx[3] },
    				(!current || dirty[0] & /*rows*/ 16) && { rows: /*rows*/ ctx[4] },
    				(!current || dirty[0] & /*placeholder*/ 4) && { placeholder: /*placeholder*/ ctx[2] },
    				(!current || dirty[0] & /*readonly*/ 256) && { readOnly: /*readonly*/ ctx[8] },
    				(!current || dirty[0] & /*maxCount*/ 32 && textarea_maxlength_value !== (textarea_maxlength_value = /*maxCount*/ ctx[5] ?? undefined)) && { maxlength: textarea_maxlength_value },
    				dirty[0] & /*$$restProps*/ 262144 && /*$$restProps*/ ctx[18]
    			]));

    			if (dirty[0] & /*value*/ 1) {
    				set_input_value(textarea, /*value*/ ctx[0]);
    			}

    			toggle_class(textarea, "bx--text-area", true);
    			toggle_class(textarea, "bx--text-area--light", /*light*/ ctx[6]);
    			toggle_class(textarea, "bx--text-area--invalid", /*invalid*/ ctx[12]);

    			if (!current || dirty[0] & /*invalid*/ 4096 && div0_data_invalid_value !== (div0_data_invalid_value = /*invalid*/ ctx[12] || undefined)) {
    				attr_dev(div0, "data-invalid", div0_data_invalid_value);
    			}

    			if (!/*invalid*/ ctx[12] && /*helperText*/ ctx[9]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_1(ctx);
    					if_block2.c();
    					if_block2.m(div1, t3);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*invalid*/ ctx[12]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block$1(ctx);
    					if_block3.c();
    					if_block3.m(div1, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
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
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			/*textarea_binding*/ ctx[32](null);
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			mounted = false;
    			run_all(dispose);
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
    	let errorId;

    	const omit_props_names = [
    		"value","placeholder","cols","rows","maxCount","light","disabled","readonly","helperText","labelText","hideLabel","invalid","invalidText","id","name","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TextArea', slots, ['labelText']);
    	const $$slots = compute_slots(slots);
    	let { value = "" } = $$props;
    	let { placeholder = "" } = $$props;
    	let { cols = 50 } = $$props;
    	let { rows = 4 } = $$props;
    	let { maxCount = undefined } = $$props;
    	let { light = false } = $$props;
    	let { disabled = false } = $$props;
    	let { readonly = false } = $$props;
    	let { helperText = "" } = $$props;
    	let { labelText = "" } = $$props;
    	let { hideLabel = false } = $$props;
    	let { invalid = false } = $$props;
    	let { invalidText = "" } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { name = undefined } = $$props;
    	let { ref = null } = $$props;

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

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler(event) {
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

    	function textarea_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	function textarea_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(18, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('placeholder' in $$new_props) $$invalidate(2, placeholder = $$new_props.placeholder);
    		if ('cols' in $$new_props) $$invalidate(3, cols = $$new_props.cols);
    		if ('rows' in $$new_props) $$invalidate(4, rows = $$new_props.rows);
    		if ('maxCount' in $$new_props) $$invalidate(5, maxCount = $$new_props.maxCount);
    		if ('light' in $$new_props) $$invalidate(6, light = $$new_props.light);
    		if ('disabled' in $$new_props) $$invalidate(7, disabled = $$new_props.disabled);
    		if ('readonly' in $$new_props) $$invalidate(8, readonly = $$new_props.readonly);
    		if ('helperText' in $$new_props) $$invalidate(9, helperText = $$new_props.helperText);
    		if ('labelText' in $$new_props) $$invalidate(10, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$new_props) $$invalidate(11, hideLabel = $$new_props.hideLabel);
    		if ('invalid' in $$new_props) $$invalidate(12, invalid = $$new_props.invalid);
    		if ('invalidText' in $$new_props) $$invalidate(13, invalidText = $$new_props.invalidText);
    		if ('id' in $$new_props) $$invalidate(14, id = $$new_props.id);
    		if ('name' in $$new_props) $$invalidate(15, name = $$new_props.name);
    		if ('ref' in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    		if ('$$scope' in $$new_props) $$invalidate(19, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		value,
    		placeholder,
    		cols,
    		rows,
    		maxCount,
    		light,
    		disabled,
    		readonly,
    		helperText,
    		labelText,
    		hideLabel,
    		invalid,
    		invalidText,
    		id,
    		name,
    		ref,
    		WarningFilled: WarningFilled$1,
    		errorId
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('placeholder' in $$props) $$invalidate(2, placeholder = $$new_props.placeholder);
    		if ('cols' in $$props) $$invalidate(3, cols = $$new_props.cols);
    		if ('rows' in $$props) $$invalidate(4, rows = $$new_props.rows);
    		if ('maxCount' in $$props) $$invalidate(5, maxCount = $$new_props.maxCount);
    		if ('light' in $$props) $$invalidate(6, light = $$new_props.light);
    		if ('disabled' in $$props) $$invalidate(7, disabled = $$new_props.disabled);
    		if ('readonly' in $$props) $$invalidate(8, readonly = $$new_props.readonly);
    		if ('helperText' in $$props) $$invalidate(9, helperText = $$new_props.helperText);
    		if ('labelText' in $$props) $$invalidate(10, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$props) $$invalidate(11, hideLabel = $$new_props.hideLabel);
    		if ('invalid' in $$props) $$invalidate(12, invalid = $$new_props.invalid);
    		if ('invalidText' in $$props) $$invalidate(13, invalidText = $$new_props.invalidText);
    		if ('id' in $$props) $$invalidate(14, id = $$new_props.id);
    		if ('name' in $$props) $$invalidate(15, name = $$new_props.name);
    		if ('ref' in $$props) $$invalidate(1, ref = $$new_props.ref);
    		if ('errorId' in $$props) $$invalidate(16, errorId = $$new_props.errorId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*id*/ 16384) {
    			$$invalidate(16, errorId = `error-${id}`);
    		}
    	};

    	return [
    		value,
    		ref,
    		placeholder,
    		cols,
    		rows,
    		maxCount,
    		light,
    		disabled,
    		readonly,
    		helperText,
    		labelText,
    		hideLabel,
    		invalid,
    		invalidText,
    		id,
    		name,
    		errorId,
    		$$slots,
    		$$restProps,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		change_handler,
    		input_handler,
    		keydown_handler,
    		keyup_handler,
    		focus_handler,
    		blur_handler,
    		paste_handler,
    		textarea_binding,
    		textarea_input_handler
    	];
    }

    class TextArea extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$4,
    			create_fragment$4,
    			safe_not_equal,
    			{
    				value: 0,
    				placeholder: 2,
    				cols: 3,
    				rows: 4,
    				maxCount: 5,
    				light: 6,
    				disabled: 7,
    				readonly: 8,
    				helperText: 9,
    				labelText: 10,
    				hideLabel: 11,
    				invalid: 12,
    				invalidText: 13,
    				id: 14,
    				name: 15,
    				ref: 1
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextArea",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get value() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cols() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cols(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rows() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxCount() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxCount(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readonly() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readonly(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperText() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperText(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelText() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelText(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideLabel() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideLabel(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalidText() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalidText(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var TextArea$1 = TextArea;

    /* node_modules/svelte-switch/src/components/CheckedIcon.svelte generated by Svelte v3.55.1 */

    const file$3 = "node_modules/svelte-switch/src/components/CheckedIcon.svelte";

    function create_fragment$3(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0");
    			attr_dev(path, "fill", "#fff");
    			attr_dev(path, "fillrule", "evenodd");
    			add_location(path, file$3, 5, 2, 105);
    			attr_dev(svg, "height", "100%");
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "viewBox", "-2 -5 17 21");
    			set_style(svg, "position", "absolute");
    			set_style(svg, "top", "0");
    			add_location(svg, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
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

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CheckedIcon', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CheckedIcon> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class CheckedIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CheckedIcon",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* node_modules/svelte-switch/src/components/UncheckedIcon.svelte generated by Svelte v3.55.1 */

    const file$2 = "node_modules/svelte-switch/src/components/UncheckedIcon.svelte";

    function create_fragment$2(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9\r\n    4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12");
    			attr_dev(path, "fill", "#fff");
    			attr_dev(path, "fillrule", "evenodd");
    			add_location(path, file$2, 5, 2, 106);
    			attr_dev(svg, "viewBox", "-2 -5 14 20");
    			attr_dev(svg, "height", "100%");
    			attr_dev(svg, "width", "100%");
    			set_style(svg, "position", "absolute");
    			set_style(svg, "top", "0");
    			add_location(svg, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
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

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UncheckedIcon', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UncheckedIcon> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class UncheckedIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UncheckedIcon",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    function createBackgroundColor(
      pos,
      checkedPos,
      uncheckedPos,
      offColor,
      onColor
    ) {
      const relativePos = (pos - uncheckedPos) / (checkedPos - uncheckedPos);
      if (relativePos === 0) {
        return offColor;
      }
      if (relativePos === 1) {
        return onColor;
      }

      let newColor = "#";
      for (let i = 1; i < 6; i += 2) {
        const offComponent = parseInt(offColor.substr(i, 2), 16);
        const onComponent = parseInt(onColor.substr(i, 2), 16);
        const weightedValue = Math.round(
          (1 - relativePos) * offComponent + relativePos * onComponent
        );
        let newComponent = weightedValue.toString(16);
        if (newComponent.length === 1) {
          newComponent = `0${newComponent}`;
        }
        newColor += newComponent;
      }
      return newColor;
    }

    function convertShorthandColor(color) {
      if (color.length === 7) {
        return color;
      }
      let sixDigitColor = "#";
      for (let i = 1; i < 4; i += 1) {
        sixDigitColor += color[i] + color[i];
      }
      return sixDigitColor;
    }

    function getBackgroundColor(
      pos,
      checkedPos,
      uncheckedPos,
      offColor,
      onColor
    ) {
      const sixDigitOffColor = convertShorthandColor(offColor);
      const sixDigitOnColor = convertShorthandColor(onColor);
      return createBackgroundColor(
        pos,
        checkedPos,
        uncheckedPos,
        sixDigitOffColor,
        sixDigitOnColor
      );
    }

    /* node_modules/svelte-switch/src/components/Switch.svelte generated by Svelte v3.55.1 */
    const file$1 = "node_modules/svelte-switch/src/components/Switch.svelte";
    const get_unCheckedIcon_slot_changes = dirty => ({});
    const get_unCheckedIcon_slot_context = ctx => ({});
    const get_checkedIcon_slot_changes = dirty => ({});
    const get_checkedIcon_slot_context = ctx => ({});

    // (313:31)
    function fallback_block_1(ctx) {
    	let cicon;
    	let current;
    	cicon = new /*CIcon*/ ctx[18]({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(cicon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cicon, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cicon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(313:31)           ",
    		ctx
    	});

    	return block;
    }

    // (318:33)
    function fallback_block(ctx) {
    	let uicon;
    	let current;
    	uicon = new /*UIcon*/ ctx[19]({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(uicon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(uicon, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(uicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(uicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(uicon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(318:33)           ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div4;
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div3;
    	let t2;
    	let input;
    	let current;
    	let mounted;
    	let dispose;
    	const checkedIcon_slot_template = /*#slots*/ ctx[35].checkedIcon;
    	const checkedIcon_slot = create_slot(checkedIcon_slot_template, ctx, /*$$scope*/ ctx[34], get_checkedIcon_slot_context);
    	const checkedIcon_slot_or_fallback = checkedIcon_slot || fallback_block_1(ctx);
    	const unCheckedIcon_slot_template = /*#slots*/ ctx[35].unCheckedIcon;
    	const unCheckedIcon_slot = create_slot(unCheckedIcon_slot_template, ctx, /*$$scope*/ ctx[34], get_unCheckedIcon_slot_context);
    	const unCheckedIcon_slot_or_fallback = unCheckedIcon_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			if (checkedIcon_slot_or_fallback) checkedIcon_slot_or_fallback.c();
    			t0 = space();
    			div1 = element("div");
    			if (unCheckedIcon_slot_or_fallback) unCheckedIcon_slot_or_fallback.c();
    			t1 = space();
    			div3 = element("div");
    			t2 = space();
    			input = element("input");
    			attr_dev(div0, "style", /*checkedIconStyle*/ ctx[5]);
    			add_location(div0, file$1, 311, 4, 8377);
    			attr_dev(div1, "style", /*uncheckedIconStyle*/ ctx[6]);
    			add_location(div1, file$1, 316, 4, 8492);
    			attr_dev(div2, "class", "react-switch-bg");
    			attr_dev(div2, "style", /*backgroundStyle*/ ctx[4]);
    			attr_dev(div2, "onmousedown", func);
    			add_location(div2, file$1, 306, 2, 8223);
    			attr_dev(div3, "class", "react-switch-handle");
    			attr_dev(div3, "style", /*handleStyle*/ ctx[7]);
    			add_location(div3, file$1, 322, 2, 8619);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "role", "switch");
    			input.disabled = /*disabled*/ ctx[0];
    			attr_dev(input, "style", /*inputStyle*/ ctx[8]);
    			add_location(input, file$1, 331, 2, 8984);
    			attr_dev(div4, "class", /*containerClass*/ ctx[1]);
    			attr_dev(div4, "style", /*rootStyle*/ ctx[3]);
    			add_location(div4, file$1, 305, 0, 8173);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div2);
    			append_dev(div2, div0);

    			if (checkedIcon_slot_or_fallback) {
    				checkedIcon_slot_or_fallback.m(div0, null);
    			}

    			append_dev(div2, t0);
    			append_dev(div2, div1);

    			if (unCheckedIcon_slot_or_fallback) {
    				unCheckedIcon_slot_or_fallback.m(div1, null);
    			}

    			append_dev(div4, t1);
    			append_dev(div4, div3);
    			append_dev(div4, t2);
    			append_dev(div4, input);
    			/*input_binding*/ ctx[36](input);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						div2,
    						"click",
    						function () {
    							if (is_function(/*disabled*/ ctx[0] ? null : /*onClick*/ ctx[17])) (/*disabled*/ ctx[0] ? null : /*onClick*/ ctx[17]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(div3, "click", click_handler, false, false, false),
    					listen_dev(
    						div3,
    						"mousedown",
    						function () {
    							if (is_function(/*disabled*/ ctx[0] ? null : /*onMouseDown*/ ctx[9])) (/*disabled*/ ctx[0] ? null : /*onMouseDown*/ ctx[9]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div3,
    						"touchstart",
    						function () {
    							if (is_function(/*disabled*/ ctx[0] ? null : /*onTouchStart*/ ctx[10])) (/*disabled*/ ctx[0] ? null : /*onTouchStart*/ ctx[10]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div3,
    						"touchmove",
    						function () {
    							if (is_function(/*disabled*/ ctx[0] ? null : /*onTouchMove*/ ctx[11])) (/*disabled*/ ctx[0] ? null : /*onTouchMove*/ ctx[11]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div3,
    						"touchend",
    						function () {
    							if (is_function(/*disabled*/ ctx[0] ? null : /*onTouchEnd*/ ctx[12])) (/*disabled*/ ctx[0] ? null : /*onTouchEnd*/ ctx[12]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div3,
    						"touchcancel",
    						function () {
    							if (is_function(/*disabled*/ ctx[0] ? null : /*unsetHasOutline*/ ctx[16])) (/*disabled*/ ctx[0] ? null : /*unsetHasOutline*/ ctx[16]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input, "focus", /*setHasOutline*/ ctx[15], false, false, false),
    					listen_dev(input, "blur", /*unsetHasOutline*/ ctx[16], false, false, false),
    					listen_dev(input, "keyup", /*onKeyUp*/ ctx[14], false, false, false),
    					listen_dev(input, "change", /*onInputChange*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (checkedIcon_slot) {
    				if (checkedIcon_slot.p && (!current || dirty[1] & /*$$scope*/ 8)) {
    					update_slot_base(
    						checkedIcon_slot,
    						checkedIcon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[34],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[34])
    						: get_slot_changes(checkedIcon_slot_template, /*$$scope*/ ctx[34], dirty, get_checkedIcon_slot_changes),
    						get_checkedIcon_slot_context
    					);
    				}
    			}

    			if (!current || dirty[0] & /*checkedIconStyle*/ 32) {
    				attr_dev(div0, "style", /*checkedIconStyle*/ ctx[5]);
    			}

    			if (unCheckedIcon_slot) {
    				if (unCheckedIcon_slot.p && (!current || dirty[1] & /*$$scope*/ 8)) {
    					update_slot_base(
    						unCheckedIcon_slot,
    						unCheckedIcon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[34],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[34])
    						: get_slot_changes(unCheckedIcon_slot_template, /*$$scope*/ ctx[34], dirty, get_unCheckedIcon_slot_changes),
    						get_unCheckedIcon_slot_context
    					);
    				}
    			}

    			if (!current || dirty[0] & /*uncheckedIconStyle*/ 64) {
    				attr_dev(div1, "style", /*uncheckedIconStyle*/ ctx[6]);
    			}

    			if (!current || dirty[0] & /*backgroundStyle*/ 16) {
    				attr_dev(div2, "style", /*backgroundStyle*/ ctx[4]);
    			}

    			if (!current || dirty[0] & /*handleStyle*/ 128) {
    				attr_dev(div3, "style", /*handleStyle*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*disabled*/ 1) {
    				prop_dev(input, "disabled", /*disabled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*inputStyle*/ 256) {
    				attr_dev(input, "style", /*inputStyle*/ ctx[8]);
    			}

    			if (!current || dirty[0] & /*containerClass*/ 2) {
    				attr_dev(div4, "class", /*containerClass*/ ctx[1]);
    			}

    			if (!current || dirty[0] & /*rootStyle*/ 8) {
    				attr_dev(div4, "style", /*rootStyle*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkedIcon_slot_or_fallback, local);
    			transition_in(unCheckedIcon_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkedIcon_slot_or_fallback, local);
    			transition_out(unCheckedIcon_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (checkedIcon_slot_or_fallback) checkedIcon_slot_or_fallback.d(detaching);
    			if (unCheckedIcon_slot_or_fallback) unCheckedIcon_slot_or_fallback.d(detaching);
    			/*input_binding*/ ctx[36](null);
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

    const func = e => e.preventDefault();
    const click_handler = e => e.preventDefault();

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Switch', slots, ['checkedIcon','unCheckedIcon']);
    	let { checked } = $$props;
    	let { disabled = false } = $$props;
    	let { offColor = "#888" } = $$props;
    	let { onColor = "#080" } = $$props;
    	let { offHandleColor = "#fff" } = $$props;
    	let { onHandleColor = "#fff" } = $$props;
    	let { handleDiameter } = $$props;
    	let { unCheckedIcon = UncheckedIcon } = $$props;
    	let { checkedIcon = CheckedIcon } = $$props;
    	let { boxShadow = null } = $$props;
    	let { activeBoxShadow = "0 0 2px 3px #3bf" } = $$props;
    	let { height = 28 } = $$props;
    	let { width = 56 } = $$props;
    	let { id = "" } = $$props;
    	let { containerClass = "" } = $$props;
    	const dispatch = createEventDispatcher();

    	//state
    	let state = {
    		handleDiameter: 0,
    		checkedPos: 0,
    		uncheckedPos: 0,
    		pos: 0,
    		lastDragAt: 0,
    		lastKeyUpAt: 0,
    		startX: null,
    		hasOutline: null,
    		dragStartingTime: null,
    		checkedStateFromDragging: false
    	};

    	let inputRef = null;
    	state.handleDiameter = handleDiameter || height - 2;
    	state.checkedPos = Math.max(width - height, width - (height + state.handleDiameter) / 2);
    	state.uncheckedPos = Math.max(0, (height - state.handleDiameter) / 2);
    	state.pos = checked ? state.checkedPos : state.uncheckedPos;
    	state.lastDragAt = 0;
    	state.lastKeyUpAt = 0;

    	//event handlers
    	function onDragStart(clientX) {
    		inputRef && inputRef.focus && inputRef.focus();
    		$$invalidate(33, state.startX = clientX, state);
    		$$invalidate(33, state.hasOutline = true, state);
    		$$invalidate(33, state.dragStartingTime = Date.now(), state);
    	}

    	function onDrag(clientX) {
    		let { startX, isDragging, pos } = state;
    		const startPos = checked ? state.checkedPos : state.uncheckedPos;
    		const mousePos = startPos + clientX - startX;

    		// We need this check to fix a windows glitch where onDrag is triggered onMouseDown in some cases
    		if (!isDragging && clientX !== startX) {
    			$$invalidate(33, state.isDragging = true, state);
    		}

    		const newPos = Math.min(state.checkedPos, Math.max(state.uncheckedPos, mousePos));

    		// Prevent unnecessary rerenders
    		if (newPos !== pos) {
    			$$invalidate(33, state.pos = newPos, state);
    		}
    	}

    	function onDragStop(event) {
    		let { pos, isDragging, dragStartingTime } = state;
    		const halfwayCheckpoint = (state.checkedPos + state.uncheckedPos) / 2;

    		// Simulate clicking the handle
    		const timeSinceStart = Date.now() - dragStartingTime;

    		if (!isDragging || timeSinceStart < 250) {
    			onChangeTrigger(event);
    		} else if (checked) {
    			if (pos > halfwayCheckpoint) {
    				$$invalidate(33, state.pos = state.checkedPos, state); // Handle dragging from checked position
    			} else {
    				onChangeTrigger(event);
    			}
    		} else if (pos < halfwayCheckpoint) {
    			$$invalidate(33, state.pos = state.uncheckedPos, state); // Handle dragging from unchecked position
    		} else {
    			onChangeTrigger(event);
    		}

    		$$invalidate(33, state.isDragging = false, state);
    		$$invalidate(33, state.hasOutline = false, state);
    		$$invalidate(33, state.lastDragAt = Date.now(), state);
    	}

    	function onMouseDown(event) {
    		event.preventDefault();

    		// Ignore right click and scroll
    		if (typeof event.button === "number" && event.button !== 0) {
    			return;
    		}

    		onDragStart(event.clientX);
    		window.addEventListener("mousemove", onMouseMove);
    		window.addEventListener("mouseup", onMouseUp);
    	}

    	function onMouseMove(event) {
    		event.preventDefault();
    		onDrag(event.clientX);
    	}

    	function onMouseUp(event) {
    		onDragStop(event);
    		window.removeEventListener("mousemove", onMouseMove);
    		window.removeEventListener("mouseup", onMouseUp);
    	}

    	function onTouchStart(event) {
    		$$invalidate(33, state.checkedStateFromDragging = null, state);
    		onDragStart(event.touches[0].clientX);
    	}

    	function onTouchMove(event) {
    		onDrag(event.touches[0].clientX);
    	}

    	function onTouchEnd(event) {
    		event.preventDefault();
    		onDragStop(event);
    	}

    	function onInputChange(event) {
    		// This condition is unfortunately needed in some browsers where the input's change event might get triggered
    		// right after the dragstop event is triggered (occurs when dropping over a label element)
    		if (Date.now() - state.lastDragAt > 50) {
    			onChangeTrigger(event);

    			// Prevent clicking label, but not key activation from setting outline to true - yes, this is absurd
    			if (Date.now() - state.lastKeyUpAt > 50) {
    				$$invalidate(33, state.hasOutline = false, state);
    			}
    		}
    	}

    	function onKeyUp() {
    		$$invalidate(33, state.lastKeyUpAt = Date.now(), state);
    	}

    	function setHasOutline() {
    		$$invalidate(33, state.hasOutline = true, state);
    	}

    	function unsetHasOutline() {
    		$$invalidate(33, state.hasOutline = false, state);
    	}

    	function onClick(event) {
    		event.preventDefault();
    		inputRef.focus();
    		onChangeTrigger(event);
    		$$invalidate(33, state.hasOutline = false, state);
    	}

    	function onChangeTrigger(event) {
    		$$invalidate(20, checked = !checked);
    		dispatch("change", { checked, event, id });
    	}

    	//Hack since components should always to starting with Capital letter and props are camelCasing
    	let CIcon = checkedIcon;

    	let UIcon = unCheckedIcon;

    	//styles
    	let rootStyle = "";

    	let backgroundStyle = "";
    	let checkedIconStyle = "";
    	let uncheckedIconStyle = "";
    	let handleStyle = "";
    	let inputStyle = "";

    	$$self.$$.on_mount.push(function () {
    		if (checked === undefined && !('checked' in $$props || $$self.$$.bound[$$self.$$.props['checked']])) {
    			console.warn("<Switch> was created without expected prop 'checked'");
    		}

    		if (handleDiameter === undefined && !('handleDiameter' in $$props || $$self.$$.bound[$$self.$$.props['handleDiameter']])) {
    			console.warn("<Switch> was created without expected prop 'handleDiameter'");
    		}
    	});

    	const writable_props = [
    		'checked',
    		'disabled',
    		'offColor',
    		'onColor',
    		'offHandleColor',
    		'onHandleColor',
    		'handleDiameter',
    		'unCheckedIcon',
    		'checkedIcon',
    		'boxShadow',
    		'activeBoxShadow',
    		'height',
    		'width',
    		'id',
    		'containerClass'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Switch> was created with unknown prop '${key}'`);
    	});

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputRef = $$value;
    			$$invalidate(2, inputRef);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('checked' in $$props) $$invalidate(20, checked = $$props.checked);
    		if ('disabled' in $$props) $$invalidate(0, disabled = $$props.disabled);
    		if ('offColor' in $$props) $$invalidate(21, offColor = $$props.offColor);
    		if ('onColor' in $$props) $$invalidate(22, onColor = $$props.onColor);
    		if ('offHandleColor' in $$props) $$invalidate(23, offHandleColor = $$props.offHandleColor);
    		if ('onHandleColor' in $$props) $$invalidate(24, onHandleColor = $$props.onHandleColor);
    		if ('handleDiameter' in $$props) $$invalidate(25, handleDiameter = $$props.handleDiameter);
    		if ('unCheckedIcon' in $$props) $$invalidate(26, unCheckedIcon = $$props.unCheckedIcon);
    		if ('checkedIcon' in $$props) $$invalidate(27, checkedIcon = $$props.checkedIcon);
    		if ('boxShadow' in $$props) $$invalidate(28, boxShadow = $$props.boxShadow);
    		if ('activeBoxShadow' in $$props) $$invalidate(29, activeBoxShadow = $$props.activeBoxShadow);
    		if ('height' in $$props) $$invalidate(30, height = $$props.height);
    		if ('width' in $$props) $$invalidate(31, width = $$props.width);
    		if ('id' in $$props) $$invalidate(32, id = $$props.id);
    		if ('containerClass' in $$props) $$invalidate(1, containerClass = $$props.containerClass);
    		if ('$$scope' in $$props) $$invalidate(34, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		createEventDispatcher,
    		defaultCheckedIcon: CheckedIcon,
    		defaultUncheckedIcon: UncheckedIcon,
    		getBackgroundColor,
    		checked,
    		disabled,
    		offColor,
    		onColor,
    		offHandleColor,
    		onHandleColor,
    		handleDiameter,
    		unCheckedIcon,
    		checkedIcon,
    		boxShadow,
    		activeBoxShadow,
    		height,
    		width,
    		id,
    		containerClass,
    		dispatch,
    		state,
    		inputRef,
    		onDragStart,
    		onDrag,
    		onDragStop,
    		onMouseDown,
    		onMouseMove,
    		onMouseUp,
    		onTouchStart,
    		onTouchMove,
    		onTouchEnd,
    		onInputChange,
    		onKeyUp,
    		setHasOutline,
    		unsetHasOutline,
    		onClick,
    		onChangeTrigger,
    		CIcon,
    		UIcon,
    		rootStyle,
    		backgroundStyle,
    		checkedIconStyle,
    		uncheckedIconStyle,
    		handleStyle,
    		inputStyle
    	});

    	$$self.$inject_state = $$props => {
    		if ('checked' in $$props) $$invalidate(20, checked = $$props.checked);
    		if ('disabled' in $$props) $$invalidate(0, disabled = $$props.disabled);
    		if ('offColor' in $$props) $$invalidate(21, offColor = $$props.offColor);
    		if ('onColor' in $$props) $$invalidate(22, onColor = $$props.onColor);
    		if ('offHandleColor' in $$props) $$invalidate(23, offHandleColor = $$props.offHandleColor);
    		if ('onHandleColor' in $$props) $$invalidate(24, onHandleColor = $$props.onHandleColor);
    		if ('handleDiameter' in $$props) $$invalidate(25, handleDiameter = $$props.handleDiameter);
    		if ('unCheckedIcon' in $$props) $$invalidate(26, unCheckedIcon = $$props.unCheckedIcon);
    		if ('checkedIcon' in $$props) $$invalidate(27, checkedIcon = $$props.checkedIcon);
    		if ('boxShadow' in $$props) $$invalidate(28, boxShadow = $$props.boxShadow);
    		if ('activeBoxShadow' in $$props) $$invalidate(29, activeBoxShadow = $$props.activeBoxShadow);
    		if ('height' in $$props) $$invalidate(30, height = $$props.height);
    		if ('width' in $$props) $$invalidate(31, width = $$props.width);
    		if ('id' in $$props) $$invalidate(32, id = $$props.id);
    		if ('containerClass' in $$props) $$invalidate(1, containerClass = $$props.containerClass);
    		if ('state' in $$props) $$invalidate(33, state = $$props.state);
    		if ('inputRef' in $$props) $$invalidate(2, inputRef = $$props.inputRef);
    		if ('CIcon' in $$props) $$invalidate(18, CIcon = $$props.CIcon);
    		if ('UIcon' in $$props) $$invalidate(19, UIcon = $$props.UIcon);
    		if ('rootStyle' in $$props) $$invalidate(3, rootStyle = $$props.rootStyle);
    		if ('backgroundStyle' in $$props) $$invalidate(4, backgroundStyle = $$props.backgroundStyle);
    		if ('checkedIconStyle' in $$props) $$invalidate(5, checkedIconStyle = $$props.checkedIconStyle);
    		if ('uncheckedIconStyle' in $$props) $$invalidate(6, uncheckedIconStyle = $$props.uncheckedIconStyle);
    		if ('handleStyle' in $$props) $$invalidate(7, handleStyle = $$props.handleStyle);
    		if ('inputStyle' in $$props) $$invalidate(8, inputStyle = $$props.inputStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*checked*/ 1048576 | $$self.$$.dirty[1] & /*state*/ 4) {
    			if (!state.isDragging) {
    				$$invalidate(33, state.pos = checked ? state.checkedPos : state.uncheckedPos, state);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*disabled, height*/ 1073741825) {
    			$$invalidate(3, rootStyle = `
    position: relative;
    display: inline-block;
    text-align: left;
    opacity: ${disabled ? 0.5 : 1};
    direction: ltr;
    border-radius: ${height / 2}px;
    transition: opacity 0.25s;
    touch-action: none;
    webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    user-select: none;
  `);
    		}

    		if ($$self.$$.dirty[0] & /*height, offColor, onColor, disabled*/ 1080033281 | $$self.$$.dirty[1] & /*width, state*/ 5) {
    			$$invalidate(4, backgroundStyle = `
    height: ${height}px;
    width: ${width}px;
    margin: ${Math.max(0, (state.handleDiameter - height) / 2)}px;
    position: relative;
    background: ${getBackgroundColor(state.pos, state.checkedPos, state.uncheckedPos, offColor, onColor)};
    border-radius: ${height / 2}px;
    cursor: ${disabled ? "default" : "pointer"};
    transition: ${state.isDragging ? null : "background 0.25s"};
  `);
    		}

    		if ($$self.$$.dirty[0] & /*height*/ 1073741824 | $$self.$$.dirty[1] & /*width, state*/ 5) {
    			$$invalidate(5, checkedIconStyle = `
    height: ${height}px;
    width: ${Math.min(height * 1.5, width - (state.handleDiameter + height) / 2 + 1)}px;
    position: relative;
    opacity:
      ${(state.pos - state.uncheckedPos) / (state.checkedPos - state.uncheckedPos)};
    pointer-events: none;
    transition: ${state.isDragging ? null : "opacity 0.25s"};
  `);
    		}

    		if ($$self.$$.dirty[0] & /*height*/ 1073741824 | $$self.$$.dirty[1] & /*width, state*/ 5) {
    			$$invalidate(6, uncheckedIconStyle = `
    height: ${height}px;
    width: ${Math.min(height * 1.5, width - (state.handleDiameter + height) / 2 + 1)}px;
    position: absolute;
    opacity:
      ${1 - (state.pos - state.uncheckedPos) / (state.checkedPos - state.uncheckedPos)};
    right: 0px;
    top: 0px;
    pointer-events: none;
    transition: ${state.isDragging ? null : "opacity 0.25s"};
  `);
    		}

    		if ($$self.$$.dirty[0] & /*offHandleColor, onHandleColor, disabled, height, activeBoxShadow, boxShadow*/ 1904214017 | $$self.$$.dirty[1] & /*state*/ 4) {
    			$$invalidate(7, handleStyle = `
    height: ${state.handleDiameter}px;
    width: ${state.handleDiameter}px;
    background: ${getBackgroundColor(state.pos, state.checkedPos, state.uncheckedPos, offHandleColor, onHandleColor)};
    display: inline-block;
    cursor: ${disabled ? "default" : "pointer"};
    border-radius: 50%;
    position: absolute;
    transform: translateX(${state.pos}px);
    top: ${Math.max(0, (height - state.handleDiameter) / 2)}px;
    outline: 0;
    box-shadow: ${state.hasOutline ? activeBoxShadow : boxShadow};
    border: 0;
    transition: ${state.isDragging
			? null
			: "background-color 0.25s, transform 0.25s, box-shadow 0.15s"};
  `);
    		}
    	};

    	$$invalidate(8, inputStyle = `
    border: 0px;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0px;
    position: absolute;
    width: 1px;
  `);

    	return [
    		disabled,
    		containerClass,
    		inputRef,
    		rootStyle,
    		backgroundStyle,
    		checkedIconStyle,
    		uncheckedIconStyle,
    		handleStyle,
    		inputStyle,
    		onMouseDown,
    		onTouchStart,
    		onTouchMove,
    		onTouchEnd,
    		onInputChange,
    		onKeyUp,
    		setHasOutline,
    		unsetHasOutline,
    		onClick,
    		CIcon,
    		UIcon,
    		checked,
    		offColor,
    		onColor,
    		offHandleColor,
    		onHandleColor,
    		handleDiameter,
    		unCheckedIcon,
    		checkedIcon,
    		boxShadow,
    		activeBoxShadow,
    		height,
    		width,
    		id,
    		state,
    		$$scope,
    		slots,
    		input_binding
    	];
    }

    class Switch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$1,
    			create_fragment$1,
    			safe_not_equal,
    			{
    				checked: 20,
    				disabled: 0,
    				offColor: 21,
    				onColor: 22,
    				offHandleColor: 23,
    				onHandleColor: 24,
    				handleDiameter: 25,
    				unCheckedIcon: 26,
    				checkedIcon: 27,
    				boxShadow: 28,
    				activeBoxShadow: 29,
    				height: 30,
    				width: 31,
    				id: 32,
    				containerClass: 1
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Switch",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get checked() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offColor() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offColor(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onColor() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onColor(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offHandleColor() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offHandleColor(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onHandleColor() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onHandleColor(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleDiameter() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleDiameter(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unCheckedIcon() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unCheckedIcon(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checkedIcon() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checkedIcon(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get boxShadow() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set boxShadow(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeBoxShadow() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeBoxShadow(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerClass() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerClass(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const TagList = [
        'Tumors & Metastases',
        'Diabetic',
        'Alzheimer\'s disease'
    ];

    /* src/App.svelte generated by Svelte v3.55.1 */

    const { Error: Error_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	return child_ctx;
    }

    // (124:5) <Dropzone on:drop={handleFilesSelect} accept=".dcm, .DCM, .tif, .svs, .vms, .vmu, .ndpi, .scn, .mrxs, .tiff, .svslide, .bif" maxSize=50GB>
    function create_default_slot(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Drag and drop files here or click to upload";
    			attr_dev(p, "class", "svelte-me5ofs");
    			add_location(p, file, 124, 6, 3611);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(124:5) <Dropzone on:drop={handleFilesSelect} accept=\\\".dcm, .DCM, .tif, .svs, .vms, .vmu, .ndpi, .scn, .mrxs, .tiff, .svslide, .bif\\\" maxSize=50GB>",
    		ctx
    	});

    	return block;
    }

    // (139:1) {#each folders as item}
    function create_each_block(ctx) {
    	let fileuploaderitem;
    	let current;

    	fileuploaderitem = new FileUploaderItem$1({
    			props: {
    				id: /*item*/ ctx[21],
    				name: /*item*/ ctx[21],
    				status: "edit"
    			},
    			$$inline: true
    		});

    	fileuploaderitem.$on("delete", /*delete_handler*/ ctx[12]);

    	const block = {
    		c: function create() {
    			create_component(fileuploaderitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fileuploaderitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fileuploaderitem_changes = {};
    			if (dirty & /*folders*/ 1) fileuploaderitem_changes.id = /*item*/ ctx[21];
    			if (dirty & /*folders*/ 1) fileuploaderitem_changes.name = /*item*/ ctx[21];
    			fileuploaderitem.$set(fileuploaderitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fileuploaderitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fileuploaderitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fileuploaderitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(139:1) {#each folders as item}",
    		ctx
    	});

    	return block;
    }

    // (179:8) {#if isUploading}
    function create_if_block(ctx) {
    	let progressbar;
    	let current;

    	progressbar = new ProgressBar$1({
    			props: { helperText: "Uploading ..." },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(progressbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(progressbar, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progressbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progressbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(progressbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(179:8) {#if isUploading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let div0;
    	let dropzone;
    	let t2;
    	let div1;
    	let switch_1;
    	let t3;
    	let span;

    	let t4_value = (/*checkedValue*/ ctx[4]
    	? 'Deidentify files'
    	: 'Keep personal information') + "";

    	let t4;
    	let t5;
    	let ol;
    	let t6;
    	let form;
    	let label0;
    	let combobox;
    	let updating_value;
    	let t7;
    	let label1;
    	let textarea;
    	let updating_value_1;
    	let t8;
    	let t9;
    	let input;
    	let current;
    	let mounted;
    	let dispose;

    	dropzone = new Dropzone({
    			props: {
    				accept: ".dcm, .DCM, .tif, .svs, .vms, .vmu, .ndpi, .scn, .mrxs, .tiff, .svslide, .bif",
    				maxSize: "50GB",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropzone.$on("drop", /*handleFilesSelect*/ ctx[8]);

    	switch_1 = new Switch({
    			props: {
    				checked: /*checkedValue*/ ctx[4],
    				onColor: "#007bff"
    			},
    			$$inline: true
    		});

    	switch_1.$on("change", /*handleChange*/ ctx[10]);
    	let each_value = /*folders*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	function combobox_value_binding(value) {
    		/*combobox_value_binding*/ ctx[13](value);
    	}

    	let combobox_props = {
    		id: /*ComboBoxId*/ ctx[6],
    		titleText: "Patient",
    		placeholder: "Choose ...",
    		items: /*patientsDropdown*/ ctx[5]
    	};

    	if (/*id*/ ctx[1] !== void 0) {
    		combobox_props.value = /*id*/ ctx[1];
    	}

    	combobox = new ComboBox$1({ props: combobox_props, $$inline: true });
    	binding_callbacks.push(() => bind(combobox, 'value', combobox_value_binding));

    	function textarea_value_binding(value) {
    		/*textarea_value_binding*/ ctx[14](value);
    	}

    	let textarea_props = {
    		id: /*TextAreaId*/ ctx[7],
    		labelText: "Comments",
    		placeholder: /*checkedValue*/ ctx[4]
    		? '(Optional) - must not contain information that allows identification. Will only be added to DICOM files'
    		: '(Optional)  Will only be added to DICOM files'
    	};

    	if (/*comment*/ ctx[2] !== void 0) {
    		textarea_props.value = /*comment*/ ctx[2];
    	}

    	textarea = new TextArea$1({ props: textarea_props, $$inline: true });
    	binding_callbacks.push(() => bind(textarea, 'value', textarea_value_binding));
    	let if_block = /*isUploading*/ ctx[3] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Data upload";
    			t1 = space();
    			div0 = element("div");
    			create_component(dropzone.$$.fragment);
    			t2 = space();
    			div1 = element("div");
    			create_component(switch_1.$$.fragment);
    			t3 = space();
    			span = element("span");
    			t4 = text(t4_value);
    			t5 = space();
    			ol = element("ol");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			form = element("form");
    			label0 = element("label");
    			create_component(combobox.$$.fragment);
    			t7 = space();
    			label1 = element("label");
    			create_component(textarea.$$.fragment);
    			t8 = space();
    			if (if_block) if_block.c();
    			t9 = space();
    			input = element("input");
    			attr_dev(h1, "class", "svelte-me5ofs");
    			add_location(h1, file, 118, 1, 3373);
    			attr_dev(div0, "class", "svelte-me5ofs");
    			add_location(div0, file, 121, 1, 3400);
    			attr_dev(span, "class", "switch-text svelte-me5ofs");
    			add_location(span, file, 134, 8, 3823);
    			attr_dev(div1, "class", "svelte-me5ofs");
    			add_location(div1, file, 128, 4, 3692);
    			attr_dev(ol, "class", "svelte-me5ofs");
    			add_location(ol, file, 137, 1, 3935);
    			attr_dev(label0, "for", /*ComboBoxId*/ ctx[6]);
    			attr_dev(label0, "class", "svelte-me5ofs");
    			add_location(label0, file, 151, 4, 4202);
    			attr_dev(label1, "for", /*TextAreaId*/ ctx[7]);
    			attr_dev(label1, "class", "svelte-me5ofs");
    			add_location(label1, file, 161, 4, 4440);
    			attr_dev(input, "type", "submit");
    			input.value = "Upload";
    			attr_dev(input, "class", "svelte-me5ofs");
    			add_location(input, file, 182, 8, 5131);
    			attr_dev(form, "class", "svelte-me5ofs");
    			add_location(form, file, 150, 4, 4166);
    			attr_dev(main, "class", "svelte-me5ofs");
    			add_location(main, file, 117, 0, 3365);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, div0);
    			mount_component(dropzone, div0, null);
    			append_dev(main, t2);
    			append_dev(main, div1);
    			mount_component(switch_1, div1, null);
    			append_dev(div1, t3);
    			append_dev(div1, span);
    			append_dev(span, t4);
    			append_dev(main, t5);
    			append_dev(main, ol);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ol, null);
    			}

    			append_dev(main, t6);
    			append_dev(main, form);
    			append_dev(form, label0);
    			mount_component(combobox, label0, null);
    			append_dev(form, t7);
    			append_dev(form, label1);
    			mount_component(textarea, label1, null);
    			append_dev(form, t8);
    			if (if_block) if_block.m(form, null);
    			append_dev(form, t9);
    			append_dev(form, input);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", /*handleSubmit*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const dropzone_changes = {};

    			if (dirty & /*$$scope*/ 16777216) {
    				dropzone_changes.$$scope = { dirty, ctx };
    			}

    			dropzone.$set(dropzone_changes);
    			const switch_1_changes = {};
    			if (dirty & /*checkedValue*/ 16) switch_1_changes.checked = /*checkedValue*/ ctx[4];
    			switch_1.$set(switch_1_changes);

    			if ((!current || dirty & /*checkedValue*/ 16) && t4_value !== (t4_value = (/*checkedValue*/ ctx[4]
    			? 'Deidentify files'
    			: 'Keep personal information') + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*folders, deleteItem*/ 513) {
    				each_value = /*folders*/ ctx[0];
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
    						each_blocks[i].m(ol, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const combobox_changes = {};

    			if (!updating_value && dirty & /*id*/ 2) {
    				updating_value = true;
    				combobox_changes.value = /*id*/ ctx[1];
    				add_flush_callback(() => updating_value = false);
    			}

    			combobox.$set(combobox_changes);
    			const textarea_changes = {};

    			if (dirty & /*checkedValue*/ 16) textarea_changes.placeholder = /*checkedValue*/ ctx[4]
    			? '(Optional) - must not contain information that allows identification. Will only be added to DICOM files'
    			: '(Optional)  Will only be added to DICOM files';

    			if (!updating_value_1 && dirty & /*comment*/ 4) {
    				updating_value_1 = true;
    				textarea_changes.value = /*comment*/ ctx[2];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			textarea.$set(textarea_changes);

    			if (/*isUploading*/ ctx[3]) {
    				if (if_block) {
    					if (dirty & /*isUploading*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(form, t9);
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
    			transition_in(dropzone.$$.fragment, local);
    			transition_in(switch_1.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(combobox.$$.fragment, local);
    			transition_in(textarea.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropzone.$$.fragment, local);
    			transition_out(switch_1.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(combobox.$$.fragment, local);
    			transition_out(textarea.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(dropzone);
    			destroy_component(switch_1);
    			destroy_each(each_blocks, detaching);
    			destroy_component(combobox);
    			destroy_component(textarea);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
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

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let files = { accepted: [], rejected: [] };
    	let studyTags = [];
    	TagList.forEach(element => studyTags.push({ id: element.toLowerCase(), text: element }));
    	let folderNames = new Set();
    	let folders = [];
    	let id = '';
    	let comment = '';
    	let isUploading = false;
    	let patientNames = JSON.parse(window.patient_names);
    	let patientsDropdown = [];
    	let tags = [];
    	let ComboBoxId = 'ComboBoxId';
    	let TextAreaId = 'TextAreaId';
    	patientNames.forEach((element, index) => patientsDropdown.push({ id: String(index), text: element }));

    	function handleFilesSelect(e) {
    		const { acceptedFiles, fileRejections } = e.detail;
    		files.accepted = [...files.accepted, ...acceptedFiles];
    		files.rejected = [...files.rejected, ...fileRejections];

    		files.accepted.forEach(element => {
    			const splitPath = element.path.split('/');

    			const folderPath = splitPath.length > 1
    			? splitPath.slice(0, -1).join('/')
    			: splitPath[0];

    			folderNames.add(folderPath);
    		});

    		$$invalidate(0, folders = [...folderNames]);
    	}

    	function deleteItem(itemName) {
    		files.accepted = files.accepted.filter(item => !item.path.includes(itemName));
    		folderNames.clear();

    		files.accepted.forEach(element => {
    			const splitPath = element.path.split('/');

    			const folderPath = splitPath.length > 1
    			? splitPath.slice(0, -1).join('/')
    			: splitPath[0];

    			folderNames.add(folderPath);
    		});

    		$$invalidate(0, folders = [...folderNames]);
    	}

    	let checkedValue = true;

    	function handleChange(e) {
    		const { checked } = e.detail;
    		$$invalidate(4, checkedValue = checked);
    	}

    	function assignTags(e) {
    		tags = e.selectedIds;
    	}

    	async function handleSubmit(event) {
    		event.preventDefault();

    		if (!id) {
    			alert('ID is required');
    			return;
    		}

    		if (files.accepted.length === 0) {
    			alert('At least one valid file is required');
    			return;
    		} else if (files.accepted.length >= 1000) {
    			alert('Only uploads with fewer than 1000 files are permitted');
    			return;
    		}

    		const formData = new FormData();
    		formData.append('id', id);
    		formData.append('comment', comment);
    		formData.append('anonymize', checkedValue);

    		// formData.append('tags', tags);
    		files.accepted.forEach(file => formData.append('files', file));

    		const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

    		try {
    			$$invalidate(3, isUploading = true);

    			const response = await fetch(window.location.href, {
    				method: 'POST',
    				body: formData,
    				headers: { 'X-CSRFToken': csrfToken }
    			});

    			if (response.ok) {
    				alert('Files uploaded successfully');
    			} else {
    				throw new Error('Failed to upload files');
    			}
    		} catch(error) {
    			alert('An error occurred while uploading the files');
    		}

    		window.location.reload();
    		$$invalidate(3, isUploading = false);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const delete_handler = e => {
    		deleteItem(e.detail);
    	};

    	function combobox_value_binding(value) {
    		id = value;
    		$$invalidate(1, id);
    	}

    	function textarea_value_binding(value) {
    		comment = value;
    		$$invalidate(2, comment);
    	}

    	$$self.$capture_state = () => ({
    		Dropzone,
    		ComboBox: ComboBox$1,
    		FileUploaderItem: FileUploaderItem$1,
    		MultiSelect: MultiSelect$1,
    		ProgressBar: ProgressBar$1,
    		TextArea: TextArea$1,
    		Switch,
    		TagList,
    		files,
    		studyTags,
    		folderNames,
    		folders,
    		id,
    		comment,
    		isUploading,
    		patientNames,
    		patientsDropdown,
    		tags,
    		ComboBoxId,
    		TextAreaId,
    		handleFilesSelect,
    		deleteItem,
    		checkedValue,
    		handleChange,
    		assignTags,
    		handleSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ('files' in $$props) files = $$props.files;
    		if ('studyTags' in $$props) studyTags = $$props.studyTags;
    		if ('folderNames' in $$props) folderNames = $$props.folderNames;
    		if ('folders' in $$props) $$invalidate(0, folders = $$props.folders);
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    		if ('comment' in $$props) $$invalidate(2, comment = $$props.comment);
    		if ('isUploading' in $$props) $$invalidate(3, isUploading = $$props.isUploading);
    		if ('patientNames' in $$props) patientNames = $$props.patientNames;
    		if ('patientsDropdown' in $$props) $$invalidate(5, patientsDropdown = $$props.patientsDropdown);
    		if ('tags' in $$props) tags = $$props.tags;
    		if ('ComboBoxId' in $$props) $$invalidate(6, ComboBoxId = $$props.ComboBoxId);
    		if ('TextAreaId' in $$props) $$invalidate(7, TextAreaId = $$props.TextAreaId);
    		if ('checkedValue' in $$props) $$invalidate(4, checkedValue = $$props.checkedValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		folders,
    		id,
    		comment,
    		isUploading,
    		checkedValue,
    		patientsDropdown,
    		ComboBoxId,
    		TextAreaId,
    		handleFilesSelect,
    		deleteItem,
    		handleChange,
    		handleSubmit,
    		delete_handler,
    		combobox_value_binding,
    		textarea_value_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		// name: 'world'
    	}
    });

    // https://stackoverflow.com/questions/31949863/django-and-dropzone-js

    return app;

})();
//# sourceMappingURL=bundle.js.map
