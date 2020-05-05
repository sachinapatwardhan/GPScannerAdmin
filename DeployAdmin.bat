
RMDIR /Q/S dist && gulp build && minify dist/styles && cd dist/styles && del app.css && del vendor.css && ren "app.min.css" "app.css" && ren "vendor.min.css" "vendor.css"
