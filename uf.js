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

			elems.forEach(function(e)
			{
				this.handleInput(e, true);
				//console.log('init elem', t.name, t.value, t.checked, t.selected, t.getAttribute('data-for'));
			}, this);

			elem.addEventListener('change', this.changeHandler.bind(this), false);
			elem.addEventListener('select', this.changeHandler.bind(this), false);
			elem.classList.add('uf');
		}
		,showCollapsible: function(id)
		{
			var collapsible = this.collapsibles[id];

			if(collapsible)
				this.collapsibles[id].classList.remove('collapsible--hidden');
		}
		,hideCollapsible: function(id)
		{
			var collapsible = this.collapsibles[id];

			if(collapsible)
				this.collapsibles[id].classList.add('collapsible--hidden');
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

					this.hideCollapsible(dataFor);
				}, this);
			}.bind(this);

			if(tag !== 'select' && dataFor === null)
				return;

			switch(tag)
			{
				case 'input':
					var type = input.type;
					if(['radio', 'checkbox'].indexOf(type) !== -1)
						this[(input.checked ? 'show' : 'hide') + 'Collapsible'](dataFor);

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
						this.showCollapsible(dataFor);

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
