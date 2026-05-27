sed -i '' '47,87c\
  // Fetch data on initial load\
  useEffect(() => {\
    let intervalId;\
    const loadData = async () => {\
      try {\
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";\
        const response = await fetch(`${API_URL}/api/products`);\
        if (response.ok) {\
          const data = await response.json();\
          setProducts(data.products || []);\
        }\
      } catch (error) {\
        console.error("Failed to load products", error);\
      } finally {\
        setLoading(false);\
      }\
    };\
    loadData();\
    intervalId = setInterval(loadData, 5000);\
    return () => clearInterval(intervalId);\
  }, []);\
' src/pages/ProductList.jsx
