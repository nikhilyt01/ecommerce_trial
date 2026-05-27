const fs = require('fs');
let content = fs.readFileSync('src/pages/ProductList.jsx', 'utf8');
content = content.replace(/import \{ usePublish \} from '\.\.\/context\/PublishContext';/g, "");
content = content.replace(/const \{ isPublished, togglePublish \} = usePublish\(\);/g, "");
content = content.replace(/const \{ unpublishedIds \} = usePublish\(\);/g, "");

content = content.replace(/isPublished={isPublished}/g, "");
content = content.replace(/togglePublish={togglePublish}/g, "");

content = content.replace(/let result = \[\.\.\.products\];/g, "let result = [...products];\n      // Publish Filter\n      if (!isAdmin) {\n        result = result.filter(p => p.isPublished === true);\n      }");

content = content.replace(/loadData\(\);\n    \}, \[\]\);/g, "loadData();\n      const intervalId = setInterval(loadData, 5000);\n      return () => clearInterval(intervalId);\n    }, []);")

fs.writeFileSync('src/pages/ProductList.jsx', content);
