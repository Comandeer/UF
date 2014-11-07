(function(global)
{
	var UF = function(selector)
	{
		var elem = this.elem = document.querySelector(selector);

		if(!elem)
			return;

		if(!elem.id)
			elem.id = 'f' + (Math.floor(Math.random() * 99999));

		this.init();
	};

	UF.prototype = {
		constructor: UF
		,init: function()
		{
			var elem = this.elem
			,elems = Array.prototype.slice.call(elem.elements)
			,collapsibles = Array.prototype.slice.call(document.querySelectorAll('#' + elem.id + ' .collapsible'))
			,tmp = [];

			collapsibles.forEach(function(t)
			{
				t.classList.add('collapsible--hidden');

				tmp[t.id] = t;
			});

			this.collapsibles = tmp;
			tmp = null;

			this.shown = {}; //hash of all shown elements

			elems.forEach(function(e)
			{
				this.handleInput(e, true);
			}, this);

			elem.addEventListener('change', this.changeHandler.bind(this), false);
			elem.addEventListener('select', this.changeHandler.bind(this), false);
			elem.classList.add('uf');
		}
		,showCollapsibles: function(ids)
		{
			ids = ids.split(' ');

			ids.forEach(function(id)
			{
				var collapsible = this.collapsibles[id];

				if(!collapsible)
					return;

				this.collapsibles[id].classList.remove('collapsible--hidden');

				if(typeof this.shown[id] != 'number')
					this.shown[id] = 0;

				++this.shown[id];
			}, this);
		}
		,hideCollapsibles: function(ids)
		{
			ids = ids.split(' ');

			ids.forEach(function(id)
			{
				var collapsible = this.collapsibles[id];

				if(!collapsible)
					return;

				if(typeof this.shown[id] != 'number' || --this.shown[id] < 0)
					this.shown[id] = 0;

				if(this.shown[id] === 0)
					this.collapsibles[id].classList.add('collapsible--hidden');
			}, this);
		}
		,handleInput: function(input, init)
		{
			var dataFor = input.getAttribute('data-for')
			,tag = input.tagName.toLowerCase()
			,hideOther = function(elems, excluded)
			{
				elems.forEach(function(e)
				{
					var dataFor = e.getAttribute('data-for');

					if(dataFor === null || e === excluded)
						return;

					this.hideCollapsibles(dataFor);
				}, this);
			}.bind(this);

			if(tag !== 'select' && dataFor === null)
				return;

			switch(tag)
			{
				case 'input':
					var type = input.type;
					if(['radio', 'checkbox'].indexOf(type) !== -1)
						this[(input.checked ? 'show' : 'hide') + 'Collapsibles'](dataFor);

					if(!init && type === 'radio')
					{
						var radios = Array.prototype.slice.call(input.form[input.name]);

						hideOther(radios, input);
					}
				break;

				case 'select':
				case 'option':
					var options = Array.prototype.slice.call(input.options)
					,selected = options[input.selectedIndex]
					,dataFor = selected.getAttribute('data-for');

					if(dataFor !== null)
						this.showCollapsibles(dataFor);

					hideOther(options, selected);
				break;
			}
		}
		,changeHandler: function(e)
		{
			if(e.target && ['input', 'select', 'option'].indexOf(e.target.tagName.toLowerCase()) !== - 1)
				this.handleInput(e.target);
		}
	}

	//UMD!
	if(typeof define === 'function' && define.amd)
		define([], function()
		{
			return UF;
		});
	else if(typeof exports === 'object')
		module.exports = UF;
	else
		global.UF = UF;
}(this));
