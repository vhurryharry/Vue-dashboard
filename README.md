# Survey dashboard app

Available at /insights/survey/<survey-id>/

## Build Setup


### Initially install all dependencies:

	$ npm install

### For developing, serve with hot reload at localhost:8080 

Make sure `JS_DEBUG = True` in dev_settings.py

(from project root):
	
	$ make run-js
	
### Build for production with minification 

(from project root):
	
	$ make build-js

This compiles JS and CSS in bundle into build directory, then compiled files are 
copied to /static/ directory (old files will be deleted) and added to git.

### Integration with Django

settings.py:

```
BUNDLES = {
    'STATIC_DIR': 'apps',
    
    # if JS_DEBUG = True, serve JS script from this location, that is served by "npm run dev"
    'DEBUG_JS_SCRIPT': '//localhost:8080/app.js',  # replace css and js with this script src
    
    # js applications
    'BUNDLES': {
    
    	# name identifies application, referred in template tags
        'insights_js_app': {
        	# where "npm run build" places compiled files
            'dist_dir': os.path.join(BASE_DIR, 'insights_js_app/dist'),
            # subdir to copy compiled CSS to
            'css_dir': 'static/css',
            # subdir to copy compiled JS to
            'js_dir': 'static/js',
            # files regexps and order to include in html as <script> tag
            'js_files': [
                '^manifest\.\w+\.js$',
                '^vendor\.\w+\.js$',
                '^app\.\w+\.js$',
            ],
            'css_files': ['^app\.\w+\.css$']
        }
    }
}
```

This JS app source code is located in `PROJECT/insights_js_app/src`, 
`npm run build` places compiled code to `PROJECT/insights_js_app/dist/static`.
`./manage collectstaticjs` deletes previous versions of application code in 
`PROJECT/static/apps/insights_js_app/` and copies there from 
`PROJECT/insights_js_app/dist/static`.

To inject js code in HTML page, use template tags:

`{% load bundletags %}` - in the top

`{% bundle_css 'insights_js_app' %}` - in `<head>`

`{% bundle_js 'insights_js_app' %}` - before `</body>`

#### Other settings

Optional setting `HIDE_3D_VIEW = True` skips rendering Cesium.js component to
save RAM while developing. Must be `False` in production env.

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
