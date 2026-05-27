const fs = require('fs');
let content = fs.readFileSync('src/pages/ProductList.jsx', 'utf8');
content = content.replace(/loadData\(\);\n    \}, \[\]\);/g, "loadData();\n      const intervalId = setInterval(loadData, 5000);\n      return () => clearInterval(intervalId);\n    }, []);");
content = content.replace(/\/\/ Publish Filter \(Only show published if not admin\)\n    if \(\!isAdmin\) \{\n      result = result\.filter\(p => isPublished\(p\.id\)\);\n    \}/g, "");
fs.writeFileSync('src/pages/ProductList.jsx', content);
