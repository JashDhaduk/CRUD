document.addEventListener("DOMContentLoaded", () => {

    const productData = JSON.parse(localStorage.getItem("productData")) || [
        {
            image: "images.png",
            productID: "PMS12345",
            productName: "iPhone",
            productPrice: "$2000",
            productDescription: "Smartphone",
        }
    ];

    const productTable = document.querySelector(".productInfo");
    const popup = document.querySelector(".popup");
    const closePopupBtn = document.querySelector(".closeBtn");
    const form = document.querySelector("#myForm");
    const submitBtn = document.querySelector(".submitBtn");
    const newProductBtn = document.querySelector(".addProduct");
    const pagination = document.querySelector(".pagination");
    const sortBySelect = document.querySelector("#sortBy");
    const pageSize = 7;
    let currentPage = 1;

    let currentEditingIndex = null;

    // Function to save data to localStorage
    function saveToLocalStorage() {
        localStorage.setItem("productData", JSON.stringify(productData));
    }

    // sorting feature
    sortBySelect.addEventListener("change", (e) => {
        const sortBy = e.target.value;

        if (sortBy) {
            sortProducts(sortBy);
        }
    });

    // Implement the search feature
    document.querySelector("#search").addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();

        const filteredProducts = productData.filter(product =>
            product.productID.toLowerCase().includes(query)
        );

        renderTable(filteredProducts);
    });

    // Handle image upload
    document.querySelector("#uploadimg").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
    
            reader.onload = function (e) {
                document.querySelector("#imagePreview").src = e.target.result;
            };
            validateForm(); 
            reader.readAsDataURL(file);
        }
    });

    //  Sorting function
    function sortProducts(sortBy) {
        let sortedProducts;

        if (sortBy === "ID") {
            sortedProducts = productData.sort((a, b) => a.productID.localeCompare(b.productID));
        } else if (sortBy === "Name") {
            sortedProducts = productData.sort((a, b) => a.productName.localeCompare(b.productName));
        } else if (sortBy === "Price") {
            sortedProducts = productData.sort((a, b) => {
                const priceA = parseFloat(a.productPrice.replace('$', ''));
                const priceB = parseFloat(b.productPrice.replace('$', ''));
                return priceA - priceB;
            });
        }

        renderTable(sortedProducts);
    }

    // Validation function to check if all fields are filled
    function validateForm() {
        const productID = document.querySelector("#pID").value;
        const productName = document.querySelector("#pName").value;
        const productPrice = document.querySelector("#pPrice").value;
        const productDescription = document.querySelector("#pDes").value;
        const productImage = document.querySelector("#imagePreview").src !== "images.png" && document.querySelector("#imagePreview").src !== ""; // Check for a valid image
    
        if (productID && productName && productPrice && productDescription && productImage) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }    

    // Add event listeners to validate the form on input
    document.querySelector("#pID").addEventListener("input", validateForm);
    document.querySelector("#pName").addEventListener("input", validateForm);
    document.querySelector("#pPrice").addEventListener("input", validateForm);
    document.querySelector("#pDes").addEventListener("input", validateForm);

    // Function to render the product table
    function renderTable(products) {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedProducts = products.slice(startIndex, endIndex);
    
        productTable.innerHTML = '';
    
        paginatedProducts.forEach((product, index) => {
            const tr = document.createElement("tr");
            tr.classList.add("productRow");
    
            tr.innerHTML = `
                <td class="tableData_1"><img src="${product.image}" alt="" height="40" width="40"></td>
                <td class="tableData_2">${product.productID}</td>
                <td class="tableData_3">${product.productName}</td>
                <td class="tableData_4">${product.productPrice}</td>
                <td class="tableData_5">${product.productDescription}</td>
                <td>
                    <button class="readBtn" onclick="viewProduct(${startIndex + index})"> <i class="fa-regular fa-eye"></i> </button>
                    <button class="editBtn" onclick="editProduct(${startIndex + index})"> <i class="fa-regular fa-pen-to-square"></i> </button>
                    <button class="deleteBtn" onclick="deleteProduct(${startIndex + index})"><i class="fa-regular fa-trash-can"></i></button>
                </td>
            `;
            productTable.appendChild(tr);
        });
    
        updatePagination(products);
    }

    // Pagination function
    function updatePagination(products) {
        const totalPages = Math.ceil(products.length / pageSize);
        pagination.innerHTML = '';

        const prevButton = document.createElement("button");
        prevButton.textContent = "Prev";
        prevButton.classList.add("pagination-btn", "prev-btn"); 
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable(products);
            }
        });
        pagination.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            pageButton.classList.toggle("active", i === currentPage);
            pageButton.addEventListener("click", () => {
                currentPage = i;
                renderTable(products);
            });
            pagination.appendChild(pageButton);
        }

        const nextButton = document.createElement("button");
        nextButton.textContent = "Next";
        nextButton.classList.add("pagination-btn", "next-btn");
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderTable(products);
            }
        });
        pagination.appendChild(nextButton);
    }

    // View product
    window.viewProduct = (index) => {
        const product = productData[index];
        currentEditingIndex = index;

        document.querySelector("#pID").value = product.productID;
        document.querySelector("#pName").value = product.productName;
        document.querySelector("#pPrice").value = parseFloat(product.productPrice.replace('$', ''));
        document.querySelector("#pDes").value = product.productDescription;
        document.querySelector("#imagePreview").src = product.image;

        popup.classList.add("open");

        document.querySelector("#pID").disabled = true;
        document.querySelector("#pName").disabled = true;
        document.querySelector("#pPrice").disabled = true;
        document.querySelector("#pDes").disabled = true;
        document.querySelector("#uploadimg").disabled = true;

        submitBtn.style.display = "none";
        validateForm();
    };

    // Edit product
    window.editProduct = (index) => {
        const product = productData[index];
        currentEditingIndex = index;
    
        document.querySelector("#pID").value = product.productID;
        document.querySelector("#pName").value = product.productName;
        document.querySelector("#pPrice").value = parseFloat(product.productPrice.replace('$', ''));
        document.querySelector("#pDes").value = product.productDescription;
        document.querySelector("#imagePreview").src = product.image || "images.png";
    
        popup.classList.add("open");
    
        document.querySelector("#pID").disabled = false;
        document.querySelector("#pName").disabled = false;
        document.querySelector("#pPrice").disabled = false;
        document.querySelector("#pDes").disabled = false;
        document.querySelector("#uploadimg").disabled = false;
    
        submitBtn.style.display = "block";
        validateForm();
    };   

    // Delete product
    window.deleteProduct = (index) => {
        if (confirm("Are you sure you want to delete this product?")) {
            productData.splice(index, 1);
            saveToLocalStorage();
            renderTable(productData);
        }
    };

    // Handle form submission
    submitBtn.addEventListener("click", (e) => {
        e.preventDefault();
    
        const productImage = document.querySelector("#imagePreview").src;
        const productID = document.querySelector("#pID").value;
        const productName = document.querySelector("#pName").value;
        const productPrice = document.querySelector("#pPrice").value;
        const productDescription = document.querySelector("#pDes").value;
    
        if (productID === "" || productName === "" || productPrice === "" || productDescription === "" || productImage === "images.png") {
            alert('Please fill all the fields and upload an image');
            return;
        }
    
        const formattedProductPrice = "$" + productPrice;
    
        if (currentEditingIndex !== null) {
            productData[currentEditingIndex] = {
                productID,
                productName,
                productPrice: formattedProductPrice,
                productDescription,
                image: productImage,
            };
        } else {
            productData.push({
                productID,
                productName,
                productPrice: formattedProductPrice,
                productDescription,
                image: productImage,
            });
        }
    
        saveToLocalStorage();
        popup.classList.remove("open");
        renderTable(productData);
    
        form.reset();
        currentEditingIndex = null;
    
        validateForm();
    });    

    // close button
    closePopupBtn.addEventListener("click", () => {
        popup.classList.remove("open");
        form.reset();
        currentEditingIndex = null;
    
        document.querySelector("#pID").disabled = false;
        document.querySelector("#pName").disabled = false;
        document.querySelector("#pPrice").disabled = false;
        document.querySelector("#pDes").disabled = false;
        document.querySelector("#imagePreview").src = "images.png";
        document.querySelector("#uploadimg").disabled = false;
    }); 

    // New Product button
    newProductBtn.addEventListener("click", () => {
        popup.classList.add("open");
        form.reset();
        currentEditingIndex = null;

        document.querySelector("#imagePreview").src = "images.png";
        document.querySelector("#uploadimg").disabled = false;

        submitBtn.style.display = "block";
        submitBtn.disabled = false;
    });

    // Render the table initially
    renderTable(productData);
});
