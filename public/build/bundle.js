
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
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

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
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
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
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
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
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
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
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
        flushing = false;
        seen_callbacks.clear();
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
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
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
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
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
            mount_component(component, options.target, options.anchor);
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.31.0' }, detail)));
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

    /* src/modules/Status.svelte generated by Svelte v3.31.0 */

    const file = "src/modules/Status.svelte";

    // (9:0) {:else}
    function create_else_block(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Station offline";
    			add_location(h1, file, 9, 4, 99);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(9:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (7:0) {#if isLive}
    function create_if_block(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Station is live";
    			add_location(h1, file, 7, 4, 62);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(7:0) {#if isLive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*isLive*/ ctx[0]) return create_if_block;
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
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
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
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Status", slots, []);
    	let { isLive } = $$props;
    	const writable_props = ["isLive"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Status> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("isLive" in $$props) $$invalidate(0, isLive = $$props.isLive);
    	};

    	$$self.$capture_state = () => ({ isLive });

    	$$self.$inject_state = $$props => {
    		if ("isLive" in $$props) $$invalidate(0, isLive = $$props.isLive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isLive];
    }

    class Status extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { isLive: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Status",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*isLive*/ ctx[0] === undefined && !("isLive" in props)) {
    			console.warn("<Status> was created without expected prop 'isLive'");
    		}
    	}

    	get isLive() {
    		throw new Error("<Status>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isLive(value) {
    		throw new Error("<Status>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*
    convert seconds to formatted time
    */
    function parseTime( sec ){
        let min = Math.floor(sec / 60);
        sec = Math.floor(sec - min * 60);
        sec = '00' + sec;
        return `${min}:${sec.slice(-2)}`;
    }

    /* src/modules/Player.svelte generated by Svelte v3.31.0 */

    const { console: console_1 } = globals;
    const file$1 = "src/modules/Player.svelte";

    // (173:64) {:else}
    function create_else_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loaded");
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
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(173:64) {:else}",
    		ctx
    	});

    	return block;
    }

    // (173:35) {#if !streamReady}
    function create_if_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Initialized");
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(173:35) {#if !streamReady}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let t0;
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let t1;
    	let button0;
    	let t3;
    	let button1;
    	let t5;
    	let span0;
    	let t6;
    	let br0;
    	let t7;
    	let div0;
    	let t8;
    	let t9;
    	let div1;
    	let t10;
    	let a;
    	let t11;
    	let t12;
    	let p;
    	let t13;
    	let t14;
    	let t15;
    	let br1;
    	let t16;
    	let br2;
    	let t17;
    	let span1;
    	let t19;
    	let embedscript;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (!/*streamReady*/ ctx[0]) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			t0 = text("// !!!!! The jQuery Version used here can be used for XSS!!\n  ");
    			script0 = element("script");
    			script1 = element("script");
    			t1 = space();
    			button0 = element("button");
    			button0.textContent = "Play";
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = "Pause";
    			t5 = space();
    			span0 = element("span");
    			t6 = space();
    			br0 = element("br");
    			t7 = space();
    			div0 = element("div");
    			t8 = text("Player Status: ");
    			if_block.c();
    			t9 = space();
    			div1 = element("div");
    			t10 = text("Artwork: ");
    			a = element("a");
    			t11 = text(/*imgSrc*/ ctx[1]);
    			t12 = space();
    			p = element("p");
    			t13 = text("Playtime in seconds: ");
    			t14 = text(/*time*/ ctx[2]);
    			t15 = space();
    			br1 = element("br");
    			t16 = space();
    			br2 = element("br");
    			t17 = space();
    			span1 = element("span");
    			span1.textContent = "Embed Code";
    			t19 = space();
    			embedscript = element("embedscript");
    			if (script0.src !== (script0_src_value = "https://code.jquery.com/jquery-1.11.3.min.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$1, 3, 2, 79);
    			if (script1.src !== (script1_src_value = "https://public.radio.co/playerapi/jquery.radiocoplayer.min.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$1, 4, 2, 173);
    			add_location(button0, file$1, 158, 2, 3583);
    			add_location(button1, file$1, 159, 2, 3635);
    			attr_dev(span0, "class", "radioplayer");
    			attr_dev(span0, "data-src", "https://s2.radio.co/s71e070cf3/listen");
    			attr_dev(span0, "data-playbutton", "false");
    			attr_dev(span0, "data-volumeslider", "false");
    			attr_dev(span0, "data-elapsedtime", "false");
    			attr_dev(span0, "data-nowplaying", "false");
    			attr_dev(span0, "data-showplayer", "false");
    			attr_dev(span0, "data-albumartwork", "false");
    			add_location(span0, file$1, 162, 0, 3689);
    			add_location(br0, file$1, 171, 0, 3943);
    			attr_dev(div0, "class", "status");
    			add_location(div0, file$1, 172, 0, 3948);
    			attr_dev(a, "href", /*imgSrc*/ ctx[1]);
    			add_location(a, file$1, 173, 30, 4067);
    			attr_dev(div1, "class", "artwork");
    			add_location(div1, file$1, 173, 0, 4037);
    			add_location(p, file$1, 176, 0, 4109);
    			add_location(br1, file$1, 179, 0, 4146);
    			add_location(br2, file$1, 180, 0, 4151);
    			add_location(span1, file$1, 181, 0, 4156);
    			add_location(embedscript, file$1, 182, 0, 4180);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, t0);
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, button1, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, span0, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t8);
    			if_block.m(div0, null);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t10);
    			append_dev(div1, a);
    			append_dev(a, t11);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t13);
    			append_dev(p, t14);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, span1, anchor);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, embedscript, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(script0, "load", /*jqueryLoaded*/ ctx[3], false, false, false),
    					listen_dev(script1, "load", /*radiocoPlayerAPILoaded*/ ctx[4], false, false, false),
    					listen_dev(button0, "click", /*handlePlayButton*/ ctx[5], false, false, false),
    					listen_dev(button1, "click", /*handlePauseButton*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}

    			if (dirty & /*imgSrc*/ 2) set_data_dev(t11, /*imgSrc*/ ctx[1]);

    			if (dirty & /*imgSrc*/ 2) {
    				attr_dev(a, "href", /*imgSrc*/ ctx[1]);
    			}

    			if (dirty & /*time*/ 4) set_data_dev(t14, /*time*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(t0);
    			detach_dev(script0);
    			detach_dev(script1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(button1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(span0);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div0);
    			if_block.d();
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(span1);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(embedscript);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Player", slots, []);
    	let mounted = false;
    	let jqueryReady = false;
    	let radiocoPlayerAPIReady = false;
    	var radiocoPlayer = null;

    	onMount(() => {
    		mounted = true;
    		console.log("Mounted");

    		if (everythingReady()) {
    			initRadiocoPlayer();
    		}
    	});

    	function jqueryLoaded() {
    		jqueryReady = true;
    		console.log("jQuery Loaded");

    		if (everythingReady()) {
    			initRadiocoPlayer();
    		}
    	}

    	function radiocoPlayerAPILoaded() {
    		radiocoPlayerAPIReady = true;
    		console.log("RadioCo Player API Loaded");

    		if (everythingReady()) {
    			initRadiocoPlayer();
    		}
    	}

    	function everythingReady() {
    		if (mounted && jqueryReady && radiocoPlayerAPIReady) return true; else return false;
    	}

    	function initRadiocoPlayer() {
    		radiocoPlayer = window.$(".radioplayer").radiocoPlayer(); // $ is reserved for svelte. Use window.$ for jquery instead
    		console.log("Init radioplayer");
    		createRadiocoPlayerEventHandlers();
    	}

    	
    	let radiocoStatusAPIReady = false;
    	let statusEmbed;

    	function radiocoStatusAPILoaded() {
    		radiocoStatusAPIReady = true;
    		console.log("RadioCo Status API Loaded");
    	}

    	// ..............................................
    	// Create Player Event Handlers
    	// ..............................................
    	let streamReady = false;

    	let audioPlaying = false;
    	let seconds = 0;
    	let imgSrc = "No Artwork";

    	function createRadiocoPlayerEventHandlers() {
    		radiocoPlayer.event("audioLoaded", function () {
    			$$invalidate(0, streamReady = true);
    			$$invalidate(1, imgSrc = radiocoPlayer.getArtwork(500, 500, 75));
    			console.log("Radio stream has loaded");
    		});

    		radiocoPlayer.event("audioPlay", function () {
    			audioPlaying = true;
    			console.log("Audio start requested");
    		});

    		radiocoPlayer.event("audioPause", function () {
    			audioPlaying = false;
    			console.log("Audio pause requested");
    		});

    		radiocoPlayer.event("timeUpdate", function (e) {
    			$$invalidate(7, seconds = e.newTime);
    		});

    		window.$(".radioplayer").onplay = function () {
    			audioPlaying = false;
    			console.log("Audio starting");
    		};
    	}

    	

    	// ..............................................
    	// Create Player Interactions
    	// ..............................................
    	function getStreamStatus() {
    		if (streamReady) {
    			let streamStatus = radiocoPlayer.getStreamState();
    			console.log(streamStatus);
    		}
    	}

    	/*
    event handlers
    */
    	function handlePlayButton() {
    		console.log("Play button clicked");

    		if (streamReady) {
    			radiocoPlayer.play();
    		}
    	}

    	function handlePauseButton() {
    		console.log("Pause button clicked");

    		if (streamReady) {
    			radiocoPlayer.pause();
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Player> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		parseTime,
    		mounted,
    		jqueryReady,
    		radiocoPlayerAPIReady,
    		radiocoPlayer,
    		jqueryLoaded,
    		radiocoPlayerAPILoaded,
    		everythingReady,
    		initRadiocoPlayer,
    		radiocoStatusAPIReady,
    		statusEmbed,
    		radiocoStatusAPILoaded,
    		streamReady,
    		audioPlaying,
    		seconds,
    		imgSrc,
    		createRadiocoPlayerEventHandlers,
    		getStreamStatus,
    		handlePlayButton,
    		handlePauseButton,
    		time
    	});

    	$$self.$inject_state = $$props => {
    		if ("mounted" in $$props) mounted = $$props.mounted;
    		if ("jqueryReady" in $$props) jqueryReady = $$props.jqueryReady;
    		if ("radiocoPlayerAPIReady" in $$props) radiocoPlayerAPIReady = $$props.radiocoPlayerAPIReady;
    		if ("radiocoPlayer" in $$props) radiocoPlayer = $$props.radiocoPlayer;
    		if ("radiocoStatusAPIReady" in $$props) radiocoStatusAPIReady = $$props.radiocoStatusAPIReady;
    		if ("statusEmbed" in $$props) statusEmbed = $$props.statusEmbed;
    		if ("streamReady" in $$props) $$invalidate(0, streamReady = $$props.streamReady);
    		if ("audioPlaying" in $$props) audioPlaying = $$props.audioPlaying;
    		if ("seconds" in $$props) $$invalidate(7, seconds = $$props.seconds);
    		if ("imgSrc" in $$props) $$invalidate(1, imgSrc = $$props.imgSrc);
    		if ("time" in $$props) $$invalidate(2, time = $$props.time);
    	};

    	let time;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*seconds*/ 128) {
    			 $$invalidate(2, time = parseTime(seconds));
    		}
    	};

    	return [
    		streamReady,
    		imgSrc,
    		time,
    		jqueryLoaded,
    		radiocoPlayerAPILoaded,
    		handlePlayButton,
    		handlePauseButton,
    		seconds
    	];
    }

    class Player extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Player",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/modules/Live.svelte generated by Svelte v3.31.0 */
    const file$2 = "src/modules/Live.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (17:4) {:else}
    function create_else_block$2(ctx) {
    	const block = { c: noop, m: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(17:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (12:4) {#each tracklist as track}
    function create_each_block(ctx) {
    	let li;
    	let h2;
    	let t1;
    	let p;
    	let t3;

    	const block = {
    		c: function create() {
    			li = element("li");
    			h2 = element("h2");
    			h2.textContent = "Show title, time";
    			t1 = space();
    			p = element("p");
    			p.textContent = "and maybe some infos about that track?";
    			t3 = space();
    			add_location(h2, file$2, 13, 12, 169);
    			add_location(p, file$2, 14, 12, 207);
    			add_location(li, file$2, 12, 8, 152);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, h2);
    			append_dev(li, t1);
    			append_dev(li, p);
    			append_dev(li, t3);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(12:4) {#each tracklist as track}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let player;
    	let t;
    	let ol;
    	let current;
    	player = new Player({ $$inline: true });
    	let each_value = /*tracklist*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block$2(ctx);
    	}

    	const block = {
    		c: function create() {
    			create_component(player.$$.fragment);
    			t = space();
    			ol = element("ol");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			add_location(ol, file$2, 10, 0, 108);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(player, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, ol, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ol, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(ol, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tracklist*/ 1) {
    				const old_length = each_value.length;
    				each_value = /*tracklist*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = old_length; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (!each_blocks[i]) {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ol, null);
    					}
    				}

    				for (i = each_value.length; i < old_length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;

    				if (each_value.length) {
    					if (each_1_else) {
    						each_1_else.d(1);
    						each_1_else = null;
    					}
    				} else if (!each_1_else) {
    					each_1_else = create_else_block$2(ctx);
    					each_1_else.c();
    					each_1_else.m(ol, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(player.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(player.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(player, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(ol);
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Live", slots, []);
    	let { tracklist = [] } = $$props;
    	const writable_props = ["tracklist"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Live> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("tracklist" in $$props) $$invalidate(0, tracklist = $$props.tracklist);
    	};

    	$$self.$capture_state = () => ({ Player, tracklist });

    	$$self.$inject_state = $$props => {
    		if ("tracklist" in $$props) $$invalidate(0, tracklist = $$props.tracklist);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tracklist];
    }

    class Live extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { tracklist: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Live",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get tracklist() {
    		throw new Error("<Live>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tracklist(value) {
    		throw new Error("<Live>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/modules/Shows.svelte generated by Svelte v3.31.0 */

    const file$3 = "src/modules/Shows.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (14:4) {:else}
    function create_else_block$3(ctx) {
    	const block = { c: noop, m: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(14:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (9:4) {#each shows as show}
    function create_each_block$1(ctx) {
    	let li;
    	let h2;
    	let t1;
    	let p;
    	let t3;

    	const block = {
    		c: function create() {
    			li = element("li");
    			h2 = element("h2");
    			h2.textContent = "Show title, date";
    			t1 = space();
    			p = element("p");
    			p.textContent = "and maybe list of played/sheduled tracks?";
    			t3 = space();
    			add_location(h2, file$3, 10, 12, 136);
    			add_location(p, file$3, 11, 12, 174);
    			add_location(li, file$3, 9, 8, 119);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, h2);
    			append_dev(li, t1);
    			append_dev(li, p);
    			append_dev(li, t3);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(9:4) {#each shows as show}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let ol;
    	let each_value = /*shows*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block$3(ctx);
    	}

    	const block = {
    		c: function create() {
    			ol = element("ol");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			add_location(ol, file$3, 7, 0, 80);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ol, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ol, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(ol, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*shows*/ 1) {
    				const old_length = each_value.length;
    				each_value = /*shows*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = old_length; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (!each_blocks[i]) {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ol, null);
    					}
    				}

    				for (i = each_value.length; i < old_length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;

    				if (each_value.length) {
    					if (each_1_else) {
    						each_1_else.d(1);
    						each_1_else = null;
    					}
    				} else if (!each_1_else) {
    					each_1_else = create_else_block$3(ctx);
    					each_1_else.c();
    					each_1_else.m(ol, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ol);
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Shows", slots, []);
    	let { shows = [] } = $$props;
    	const writable_props = ["shows"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Shows> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("shows" in $$props) $$invalidate(0, shows = $$props.shows);
    	};

    	$$self.$capture_state = () => ({ shows });

    	$$self.$inject_state = $$props => {
    		if ("shows" in $$props) $$invalidate(0, shows = $$props.shows);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [shows];
    }

    class Shows extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { shows: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Shows",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get shows() {
    		throw new Error("<Shows>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shows(value) {
    		throw new Error("<Shows>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.31.0 */

    // (12:4) {#if isLive}
    function create_if_block$2(ctx) {
    	let live;
    	let current;
    	live = new Live({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(live.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(live, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(live.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(live.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(live, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(12:4) {#if isLive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let status;
    	let t0;
    	let t1;
    	let shows;
    	let current;
    	status = new Status({ props: { isLive: true }, $$inline: true });
    	let if_block = /*isLive*/ ctx[0] && create_if_block$2(ctx);
    	shows = new Shows({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(status.$$.fragment);
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			create_component(shows.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(status, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(shows, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(status.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(shows.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(status.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(shows.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(status, detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(shows, detaching);
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
    	validate_slots("App", slots, []);
    	let isLive = true;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Status, Live, Shows, isLive });

    	$$self.$inject_state = $$props => {
    		if ("isLive" in $$props) $$invalidate(0, isLive = $$props.isLive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isLive];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
