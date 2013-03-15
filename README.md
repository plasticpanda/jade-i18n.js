# jade-i18n.js - Static i18-d website generator #
Compiles Jade templates in multiple languages using a JSON file for the translations.


```bash
npm install -g jade-i18n.js
jade-i18n.js --help
```

## Templates ##

To define translated paragraphs use the ```:trans``` filter, with a ```context``` parameter which defines a **unique identifier** for this paragraph.

```
p
	:trans(context=my-demo)
		Here is the content
```


## Usage ##

0. Create some directories

	```bash
	mkdir ../output 	# Compiled HTML files goes here
	mkdir ../locale		# Created locale files will be saved here
	```

1. Create your templates
2. Create initial locale files

	*This will overwrite existing files*

	```bash
	jade-i18n.js template1.jade template2.jade -L ../locale/ -l en,it,br -o ../output/ --init --update
	```

3. Give the locale files generated in ../locale/ to your translator and wait :P

	**PS:** We've built a tool, [i18n.li](http://www.i18n.li/) to help human beings to translate this format.
	
	```js
	{
		"MY-DEMO": { /* Context name (all uppercase - don't change this) */
			"original": "It's me,", /* Original string, for reference only */
			"translated": "Sono io,", /* Translated string */
			"fuzzy": true /* true if this string is not translated yet */
		},
		...
	}
	```

4. Recompile

	```bash
	jade-i18n.js template1.jade template2.jade -L ../locale/ -l en,it,br -o ../output/
	```

5. If you change or add a string you may want to update the locale file

	```bash
	jade-i18n.js template1.jade template2.jade -L ../locale/ -l en,it,br -o ../output/ --update
	```

## Example ##

* Template

```jade
doctype 5
html
	head
		body
			h1 
				:trans(context=h1)
					It's me,
			p
				:trans(context=p1)
					Foo!
				:trans(context=fanculo)
					Geena
			footer
				:trans(context=footer)
					(c) Me
				:trans(context=year)
					2013
```

* Compile

```bash
jade-i18n.js tests/*.jade -L tests/locale/ -l en,it,de,fr,gr -o output/ --init --update
```

* Enjoy

```
    output/
    ├── de
    │   └── tests
    │       ├── index2.html
    │       └── index.html
    ├── en
    │   └── tests
    │       ├── index2.html
    │       └── index.html
    ├── fr
    │   └── tests
    │       ├── index2.html
    │       └── index.html
    ├── gr
    │   └── tests
    │       ├── index2.html
    │       └── index.html
    └── it
        └── tests
            ├── index2.html
            └── index.html
```

## Todo ##
* Tests
* Tests
* Tests


## License (MIT) ##
Copyright (c) 2013 [plasticpanda.com](http://www.plasticpanda.com).

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



