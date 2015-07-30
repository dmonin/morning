# run this file in the root directory (parallel to closure library)
if [ -d "closure-library"]; then
  closure-library/closure/bin/build/depswriter.py --root_with_prefix="moninjs ../../../moninjs" > moninjs/demos/assets/js/deps.js
else
  echo "Please run this command parallel to moninjs & closure-library directories"
fi