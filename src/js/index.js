window.addEventListener('load', ()=>{
    //Libreria necesaria para que funcione la funcion "async/await"
    require("babel-core/register");
    require("babel-polyfill");
    

    let contenedorColores = document.querySelector('#todosLosColores')
    let filtrar = document.querySelector('.filtrar')
    let mostrarColores = document.querySelector('#mostrarColores')
    let contenedorCards = document.querySelector('.contenedorImagenes')
    let precios = document.querySelectorAll('.precios')
    let tamanios = document.querySelector('.contenedorTamanios').childNodes;
    let btnOrdernarPor = document.querySelector('#ordenarPor')
    let comoOrdenar = document.querySelector('#comoOrdenar').childNodes;
    let colores = document.querySelectorAll('.color')
    let cagarMas = document.querySelector('#botonCargarMas')
    let ordenarCelular = document.querySelector('#ordenarPorCelular')
    let filtrarCelular = document.querySelector('#filtrarCelular')
    let contenedorMenuCelular = document.createElement('div')
    let botonAplicar = document.querySelector('.botonAplicar')
    let botonLimpiar = document.querySelector('.botonLimpiar')
    let datosFiltrados = []
    let cantidad = 9


    renderizarTodo()
    
    
    let Checked = null;
    // obtengo todos los checkbox agrupados en colores
    for (let CheckBox of colores){
        CheckBox.addEventListener('change', () =>{
            renderizarColores(CheckBox.getAttribute('name'), datosFiltrados)
            if(Checked!=null){
                Checked.checked = false;
                Checked = CheckBox;
                if (CheckBox.checked == false) {
                    // si el checkbox se "destildo" vuelvo a renderizar todo
                    renderizarTodo()
                }
            }
            Checked = CheckBox;
        }) 
    }


    // obtengo todos los checkbox agrupados en tamanios
    for (let tamanio of tamanios){
        tamanio.addEventListener('click', () =>{
            // pregunto si el tamanio seleccionado estaba anteriormente seleccionado
            if(tamanio.classList.contains('tamanioElegido')){
                // en caso de estarlo remuevo la clase y vuelvo a renderizar todo
                tamanio.classList.remove('tamanioElegido')
                renderizarTodo();
            }else{
                // en caso de no estarlo le agrego la clase y renderizo a partir de lo que estuviera anteriormente renderizado
                tamanio.classList.add('tamanioElegido')
                renderizarPorTamanios(tamanio.textContent, datosFiltrados)
            }
        }) 
    }


    let precioChecked = null;
    // obtengo todos los checkbox agrupados en precios
    for (let precio of precios){
        precio.addEventListener('change', () =>{
            preciosLimite = precio.getAttribute('name').split('a')
            renderizarPorPrecio(parseInt(preciosLimite[0]),parseInt(preciosLimite[1]), datosFiltrados)
            if(precioChecked!=null){
                precioChecked.checked = false;
                precioChecked = precio;
                if (precio.checked == false) {
                    renderizarTodo();
                }
            }
            precioChecked = precio;
            
        }) 
    }
    

    for(let orden of comoOrdenar ){
        orden.addEventListener('click', () => {
            btnOrdernarPor.textContent = orden.textContent
            ordenar(orden.textContent, datosFiltrados)
        })
    }

    async function obtenerLosDatos(){
        try{
            const res = await fetch("http://localhost:5000/products")
            datos = await res.json()
            return datos
        }catch(e){
            console.log(e);
        }
        
    }
    
    function renderizar(datos){
        let iterador=0;
        // limpio el contenedor de las cartas antes de volver a renderizar
        contenedorCards.innerHTML = ''
        if(datos.length == 0){
            // en caso de no encontrarse datos envio renderizo un mensaje 
            noHayDatos()
        }
        datos.forEach(dato => {
                // renderizo una cantidad determinada de cartas
                // dicha cantidad esta determinada por la variable "cantidad"
                if(iterador < cantidad) {
                    contenedorCards.innerHTML += `<div class="card">
                                                <img src="${dato.image}" alt="">
                                                <h2>${dato.name.toUpperCase()}</h2>
                                                <p class=precio>R$ ${dato.price}</p>
                                                <p class="descTalle">até ${dato.parcelamento[0]}x de R$${dato.parcelamento[1]}</p>
                                                <button>COMPRAR</button>
                                            </div>`
                                        }
                                        iterador++;
        });
        cuantoCargar()
    }

    function cuantoCargar() {
        // escucho el evento click sobre el boton cargar mas
        cagarMas.addEventListener('click', () => {
            // en caso de poder cargar mas, se carga en tandas de 3
            cantidad += 3;
            if (contenedorCards.childElementCount%3 == 0) {
                renderizar(datosFiltrados);
            }else{
                cagarMas.style.display = 'none'
            }
        })
        
    }
    

    function renderizarColores(colorElegido, datosARenderizar) {
        // filtro en los datos previamente renderizados los que tengan el color deseado
        datosFiltrados = datosARenderizar.filter(dato => dato.color == colorElegido)
        renderizar(datosFiltrados)
        return datosFiltrados
    }

    
    function renderizarPorTamanios(tamanio, datosARenderizar) {
        // filtro en los datos previamente renderizados los que tengan el tamanio deseado
        datosFiltrados = datosARenderizar.filter(dato => dato.size.includes(tamanio))
        renderizar(datosFiltrados)
        return datosFiltrados

    }

    function renderizarPorPrecio(precioMinimo,precioMaximo, datosARenderizar) {
        // filtro en los datos previamente renderizados los que tengan el precio deseado
        datosFiltrados = datosARenderizar.filter(dato => dato.price > precioMinimo && dato.price < precioMaximo)
        renderizar(datosFiltrados)
        return datosFiltrados
        
    }

    function ordenar(param, datosFiltrados) {
        if(param == 'Menor preço'){
            datosFiltrados = datosFiltrados.sort((a,b)=>{
                return (a.price - b.price)
            })
            renderizar(datosFiltrados)
        }else if(param == 'Maior preço'){
            datosFiltrados = datos.sort((a,b)=>{
                return (b.price - a.price)
            })
            renderizar(datosFiltrados)
            
        }else{
            datosFiltrados = datosFiltrados.sort((a,b)=>{
                dateA = new Date(a.date)
                dateB = new Date(b.date)
                return (dateA.getTime() - dateB.getTime())
            })
            renderizar(datosFiltrados)
        }
    }

    function noHayDatos() {
        contenedorCards.innerHTML = 'No hay Blusas con los filtros seleccionados'
    }
    
    mostrarColores.addEventListener('click', () => {
        contenedorColores.classList.remove("coloresOcultos")
        mostrarColores.classList.add('ocultar')
    })

    function renderizarTodo() {
        obtenerLosDatos().then(datos => {
            renderizar(datos)
            datosFiltrados = datos;
            cagarMas.style.display = 'block'
            cantidad = 9
        })
    }

    ordenarCelular.addEventListener('click',() => {
        desplegarMenu();
        contenedorMenuCelular.innerHTML= `<div class='filtrarOrdenar'><h2>ORDENAR</h2><i class="fas fa-times"></i></div><hr><div><p>Mas recentes</p><p>Menor preço</p><p>Maior preço</p></div>`
        let cerrar = document.querySelector('i')
        cancelar(cerrar)
        document.querySelector('main').style.display = 'none'
        let formasDeOrdenar = document.querySelectorAll('p')
        formasDeOrdenar.forEach(formaDeOrdenar => {
            formaDeOrdenar.addEventListener('click', () => {
                ordenar(formaDeOrdenar.textContent, datosFiltrados);
                document.querySelector('main').style.display = 'block'
                contenedorMenuCelular.innerHTML = ''
                contenedorMenuCelular.style.display = 'none'
            })
        });
    })

    filtrarCelular.addEventListener('click',() => {
        desplegarMenu()
        document.querySelector('main').style.display = 'none'
        contenedorMenuCelular.innerHTML= `<div class='filtrarOrdenar'><h2>ORDENAR</h2><i class="fas fa-times"></i></div><hr>`
        let cerrar = document.querySelector('.fa-times')
        filtrar.style.display = 'block'
        contenedorMenuCelular.appendChild(filtrar)
        let flechas = document.querySelectorAll('.fa-chevron-down')
        flechas.forEach(flecha => {
            flecha.addEventListener('click', () =>{

                if(flecha.parentElement.nextElementSibling.style.display == 'none'){

                    if (flecha.parentElement.nextElementSibling.classList.contains('contenedorTamanios')) {
                        flecha.parentElement.nextElementSibling.style.display = 'flex'
                    }else{
                        flecha.parentElement.nextElementSibling.style.display = 'block'
                    }
                    
                }else{
                    flecha.parentElement.nextElementSibling.style.display = 'none'
                }
                
            })
        })
        botonAplicar.addEventListener('click',()=>{
            document.querySelector('main').style.display = 'block'
            contenedorMenuCelular.style.display = 'none'
            contenedorMenuCelular.innerHTML = ''
        })

        botonLimpiar.addEventListener('click', () => {
            let todosLosCheckBox = document.querySelectorAll('input')
            let tamanios = document.querySelector('.contenedorTamanios').querySelectorAll('div')
            for (let checkbox of todosLosCheckBox) {
                if(checkbox.checked){
                    checkbox.checked = false
                }
            }
            for (let tamanio of tamanios) {
                tamanio.classList.remove('tamanioElegido')
            }
        })
        cancelar(cerrar)

    })    

    function desplegarMenu() {
        document.body.appendChild(contenedorMenuCelular)
        contenedorMenuCelular.style.display = 'block'
        contenedorMenuCelular.classList.add('menuCompleto')
    }

    function cancelar(cerrar) {
        cerrar.addEventListener('click', () => {
            document.querySelector('main').style.display = 'block'
            contenedorMenuCelular.style.display = 'none'
            contenedorMenuCelular.innerHTML = ''
            obtenerLosDatos().then(datos => {
                renderizar(datos)
                datosFiltrados = datos;
            })
        })
    }

})
