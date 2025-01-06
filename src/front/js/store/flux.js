const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			token: null,
			currentUser: null,
			isLogged: false,
			photo: null,
			name: "",
			active: false,
			description: "",
			position: "",
			price: "",
			amount: "",
			products: null,
			category_id: "",
			subcategory_id: "",






			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},

			checkUser: () => {
				const token = sessionStorage.getItem("token")
				if (token) {
					setStore({
						token: token,
						isLogged: true,
						currentUser: JSON.parse(sessionStorage.getItem("currentUser"))
					})
				}

			},
			handleSubmit: async (e) => {
				e.preventDefault();
				try {
					const { email, password } = e.target
					const response = await fetch("https://opulent-succotash-pjgxgx4rq7xqcr4rg-3001.app.github.dev/api/login", {
						method: "POST",
						headers: {
							"Content-type": "application/json"
						},
						body: JSON.stringify({ email: email.value, password: password.value })
					})
					if (response.ok) {

						const data = await response.json();
						const currentUser = {
							email: email.value,
							admin: data.admin || false,
							name: data.name,
							lastname: data.lastname,
							photo: data.photo
						};

						console.log("Token:", data.token);
						sessionStorage.setItem("token", data.token);
						sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
						setStore({
							token: data.token,
							isLogged: true,
							currentUser
						})
						email.value = ""
						password.value = ""

					}
				} catch (error) {
					console.error("Error al realizar el fetch: ", error)
				}

			},

			logout: () => {
				sessionStorage.removeItem("token");
				sessionStorage.removeItem("currentUser");
				setStore({
					token: null,
					isLogged: false,
					currentUser: null,
				});
				window.location.href = "/";
			},
			setPhoto: (e) => {
				setStore({ photo: e.target.files[0] })
			},
			handleChange: e => {
				const { name, value } = e.target
				setStore({
					[name]: value
				})
			},
			createProduct: async (e) => {
				try {
					e.preventDefault()
					const { name, photo, active, description, position, price, amount, category_id, subcategory_id } = getStore()

					const formData = new FormData();
					formData.append("name", name);
					formData.append("photo", photo);
					formData.append("active", active);
					formData.append("description", description);
					formData.append("position", position);
					formData.append("price", price);
					formData.append("amount", amount);
					formData.append("category_id", category_id);
					formData.append("subcategory_id", subcategory_id);


					const cloudResponse = await fetch(
						"https://opulent-succotash-pjgxgx4rq7xqcr4rg-3001.app.github.dev/api/products",
						{
							method: "POST",
							body: formData,
						}
					);
					if (!cloudResponse.ok) {
						throw new Error("Error al subir el producto, error 400")
					}
					const data = await cloudResponse.json()
					console.log("Se ha creado el producto", data)
					alert("Producto creado correctamente")



					setStore({
						name: "",
						photo: null,
						active: false,
						description: "",
						position: "",
						price: "",
						amount: "",
						category_id: "",
						subcategory_id: "",

					})

				}
				catch (error) {
					console.log("Error creando el producto", error.message)
					alert(error.message)
				}
			},
			deleteProduct: async (id) => {
				try {
					const response = await fetch(`https://opulent-succotash-pjgxgx4rq7xqcr4rg-3001.app.github.dev/api/products/${id}`, {
						method: 'DELETE',
						headers: {
							"Content-Type": "application/json"
						}
					});
					if (response.ok) {
						alert("Producto eliminado con éxito")
						getActions().fetchProducts()
					} else {
						throw new Error("Error eliminando el producto");
					}
				}
				catch (error) {
					console.error("Problemas eliminando el producto", error)
				}
			},
			fetchProducts: async () => {
				try {
					const response = await fetch("https://opulent-succotash-pjgxgx4rq7xqcr4rg-3001.app.github.dev/api/products");
					const data = await response.json();
					setStore({ products: data });
				} catch (error) {
					console.error("Error al cargar productos:", error);
				}
			},
			editProduct: async (e, id) => {
				try {
					e.preventDefault()
					const { name, photo, active, description, position, price, amount, category_id, subcategory_id } = getStore()

					const formData = new FormData();
					formData.append("name", name);
					formData.append("photo", photo);
					formData.append("active", active);
					formData.append("description", description);
					formData.append("position", position);
					formData.append("price", price);
					formData.append("amount", amount);
					formData.append("category_id", category_id);
					formData.append("subcategory_id", subcategory_id);


					const cloudResponse = await fetch(
						"https://opulent-succotash-pjgxgx4rq7xqcr4rg-3001.app.github.dev/api/products/" + id,
						{
							method: "PUT",
							body: formData,
						}
					);
					if (!cloudResponse.ok) {
						throw new Error("Error al actualizar el producto, error 400")
					}
					const data = await cloudResponse.json()
					console.log("Se ha actualizado  el producto", data)
					alert("Producto actualizado correctamente")



					setStore({
						name: "",
						photo: null,
						active: false,
						description: "",
						position: "",
						price: "",
						amount: "",
						category_id: "",
						subcategory_id: "",

					})

				}
				catch (error) {
					console.log("Error creando el producto", error.message)
					alert(error.message)
				}
			},
			getProductById: async (id) => {
				try {
					const response = await fetch(`https://opulent-succotash-pjgxgx4rq7xqcr4rg-3001.app.github.dev/api/products/${id}`);
					if (!response.ok)
						throw new Error("Error en el fetch");

					const product = await response.json();
					console.log(product)
					setStore({
						name: product.name,
						photo: product.photo,
						active: product.active,
						description: product.description,
						position: product.position,
						price: product.price,
						amount: product.amount,
						category_id: product.category_id,
						subcategory_id: product.subcategory_id,
						order: product.order,

					})
				} catch (error) {
					console.error("Error en el fetch1:", error);
				}

			},
			updateProduct: async (id, updatedProduct) => {
				try {
					const response = await fetch(`https://opulent-succotash-pjgxgx4rq7xqcr4rg-3001.app.github.dev/api/products/${id}`, {
						method: "PUT",
						body: formData,
					});
					if (!response.ok) throw new Error("Error al actualizar producto");
					const data = await response.json();


					const store = getStore();
					const updatedProducts = store.products.map((product) =>
						product.id === id ? data.product : product
					);
					setStore({ products: updatedProducts });

					return true;
				} catch (error) {
					console.error("Error actualizando producto:", error);
					return false;
				}



			}
		}
	};
};

export default getState;
