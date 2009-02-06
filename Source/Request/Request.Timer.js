/*
Script: Request.Timer.js
	Requests the same url at a time interval that increases when no data is returned from the requested server

	License:
		MIT-style license.

	Authors:
		Christoph Pojer

*/
(function(){
	var maker = function(klass) {
		return {

			Extends: klass,

			options: {
				initialDelay: 5000,
				delay: 5000,
				limit: 60000
			},

			start: function(data){
				var fn = (function(){
					if (!this.running) this.send({data: data});
				});
				this.timer = fn.delay(this.options.initialDelay, this);
				this.lastDelay = this.options.initialDelay;
				this.completeCheck = function(j){
					$clear(this.timer);
					if (j) this.lastDelay = this.options.delay;
					else this.lastDelay = (this.lastDelay+this.options.delay).min(this.options.limit);
					this.timer = fn.delay(this.lastDelay, this);
				};
				this.addEvent('complete', this.completeCheck);
				return this;
			},

			stop: function(){
				$clear(this.timer);
				this.removeEvent('complete', this.completeCheck);
				return this;
			}
		};
	};

	Request.Timer = maker(Request);
	Request.HTML.Timer = maker(Request.HTML);
	Request.JSON.Timer = maker(Request.JSON);

});