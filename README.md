# Elfo Backend

Este es el backend de ELFO. Esta API facilita la gestión de productos y usuarios, permitiendo la personalización de filtros y categorías para mejorar la experiencia de descubrimiento de regalos. La API ofrece funcionalidades completas para manejar productos, favoritos, comentarios, y un sistema de administración para gestionar categorías y filtros.

La API está construida con Node.js y Express, utilizando MongoDB Atlas para la base de datos y Firebase para la autenticación y almacenamiento de imágenes subidas por el usuario.

El frontend de ELFO se puede encontrar en:
https://github.com/Manteca24/front-elfo

El back de ELFO está desplegado en Render y se puede ver en el siguiente enlace: https://back-elfo.onrender.com/

## Funcionalidades

- **Autenticación**: Registro y login de usuarios con Firebase.
- **Gestión de productos**: Los usuarios pueden añadir productos a la base de datos con atributos como nombre, precio, imagen, descripción, etc.
- **Favoritos**: Los usuarios pueden añadir o eliminar productos de sus favoritos.
- **Filtrado de productos**: Los productos pueden ser filtrados por diversas categorías, edad, personalidad, etc.
- **Comentarios**: Los usuarios pueden dejar comentarios sobre productos.
- **Personas guardadas**: Los usuarios pueden guardar personas para ahorrar tiempo de selección de filtros en siguientes búsquedas de regalos.
- **Panel de administrador**: Si el usuario es administrador tiene un apartado para administrar Categoría y Filtros. Está pensado para ser ampliado y poder incluir Gestión de productos y de usuarios, moderación de contenido, estadísticas y mantenimiento.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución de JavaScript para el backend.
- **Express**: Framework web para Node.js que facilita la creación de la API REST.
- **MongoDB**: Base de datos NoSQL utilizada para almacenar productos, usuarios y favoritos.
- **Mongoose**: Librería para modelar datos y realizar operaciones con MongoDB de manera más sencilla.

## Dependencias

- **bcryptjs**: `2.4.3` - Biblioteca para encriptar contraseñas de manera segura.
- **cookie-parser**: `1.4.7` - Middleware para parsear cookies en las solicitudes HTTP.
- **cors**: `2.8.5` - Middleware para habilitar CORS (Cross-Origin Resource Sharing).
- **dotenv**: `16.4.5` - Cargar variables de entorno desde un archivo `.env`.
- **express**: `4.21.1` - Framework web para Node.js, utilizado para manejar las rutas y solicitudes.
- **firebase-admin**: `13.0.1` - SDK administrativo de Firebase para la interacción con los servicios de Firebase.
- **mongoose**: `8.8.1` - ODM (Object Data Modeling) para MongoDB, usado para interactuar con la base de datos.

## Endpoints

#### Usuarios

- `GET /users/`: Obtener todos los usuarios.
- `GET /users/username/:username`: Obtener un usuario por su username.
- `GET /users/user/:id`: Obtener un usuario por su ID en MongoDB.
- `GET /users/user`: Obtener un usuario por su ID (requiere token de autenticación).
- `POST /users/user`: Crear un nuevo usuario.
- `PUT /users/user`: Actualizar un usuario (requiere token de autenticación, solo para el usuario o administrador).
- `DELETE /users/user`: Eliminar un usuario (requiere token de autenticación, solo para el usuario o administrador).

#### Favoritos

- `POST /users/favorites`: Añadir un producto favorito y asignar una persona a la que se lo regalarías (requiere token de autenticación, solo para usuario o administrador).
- `GET /users/favorites`: Obtener los productos favoritos de un usuario y sus "para quién" (requiere token de autenticación, solo para usuario o administrador).
- `DELETE /users/favorites/:favoriteId`: Eliminar un producto favorito (requiere token de autenticación, solo para usuario o administrador).

#### Personas Guardadas

- `POST /users/saved-people`: Añadir una persona a "mis personas" con sus propios filtros guardados (requiere token de autenticación, solo para usuario o administrador).
- `GET /users/saved-people`: Obtener "mis personas" de un usuario por su ID (requiere token de autenticación, solo para usuario o administrador).
- `PUT /users/saved-people/:personId/filters/:filterId/tags`: Actualizar los tags de una persona en "mis personas" (requiere token de autenticación, solo para usuario o administrador).
- `DELETE /users/saved-people/:personId`: Eliminar una persona de "mis personas" (requiere token de autenticación, solo para usuario o administrador).

### Productos

- `GET /products/`: Obtener todos los productos.
- `GET /products/:id`: Obtener un producto por su ID.
- `POST /products/`: Crear un nuevo producto (solo usuarios registrados).
- `PUT /products/:id`: Actualizar un producto por su ID (solo el creador).
- `DELETE /products/:id`: Eliminar un producto por su ID (solo el creador o administrador).
- `POST /products/:productId/addCategory/:categoryId`: Añadir una categoría existente a un producto existente.

### Comentarios

- `POST /comments/:productId`: Crear un comentario en un producto (solo usuarios registrados).
- `GET /comments/product/:productId`: Obtener los comentarios de un producto.
- `GET /comments/user/:userId`: Obtener los comentarios de un usuario.
- `PUT /comments/:commentId`: Editar un comentario en un producto (solo el usuario que lo creó).
- `DELETE /comments/:commentId`: Borrar un comentario en un producto (solo el administrador).

### Filtros

- `POST /filters/`: Crear un filtro.
- `GET /filters/`: Obtener todos los filtros.
- `PUT /filters/:filterId/tags`: Añadir tags a un filtro.
- `GET /filters/grouped`: Obtener filtros agrupados por categoría.
- `GET /filters/:filterId`: Obtener un filtro por ID.
- `DELETE /filters/:filterId/tags`: Eliminar un tag de un filtro.

### Búsqueda

- `GET /search/`: Buscar regalos.
- `GET /search/products`: Buscar productos.
- `GET /search/categories`: Buscar categorías.
- `GET /search/filters`: Buscar filtros.
- `GET /search/person/:personId`: Buscar por persona.

## Instalación

### Prerequisitos

- Node.js
- MongoDB Atlas

### Pasos de instalación

1. Clona el repositorio:

   > git clone <https://github.com/Manteca24/back-elfo.git>
   > cd elfo-backend
   > npm install
   > // Crea un archivo .env en la raíz del proyecto y agrega tus variables de entorno:
   > MONGO_URI=<tu URI de MongoDB Atlas>
   > npm start

## Base de Datos

La aplicación utiliza MongoDB Atlas para almacenar los datos. Los esquemas principales incluyen:

```javascript
// CATEGORÍA
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  filters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Filter" }],
});

// COMENTARIO
const commentSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// FILTRO
const filterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  tags: { type: [String], default: [] },
});

// PRODUCTO
const productSchema = new mongoose.Schema({
  // en cuanto al producto...
  name: { type: String, required: true },
  description: { type: String },
  tags: { type: [String], default: [] },
  type: {
    type: String,
    enum: ["diy", "experiencia", "material"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "El precio debe ser un valor positivo"],
  },
  purchaseLocation: {
    ubication: {
      type: String,
      enum: ["diy", "online", "cadena", "local"],
      required: true,
    },
    storeName: { type: String, required: false },
    url: { type: String, required: false },
  },
  image: { type: String, required: true },
  // en cuanto a la persona a la que se lo regalaste...
  relation: {
    type: String,
    enum: [
      "madre",
      "padre",
      "hermana",
      "hermano",
      "hija",
      "hijo",
      "abuela",
      "abuelo",
      "tía",
      "tío",
      "prima",
      "primo",
      "amiga",
      "amigo",
      "sobrina",
      "sobrino",
      "pareja",
      "novia",
      "novio",
      "esposo",
      "esposa",
      "compañero de trabajo",
      "compañera de trabajo",
      "jefe",
      "jefa",
      "vecino",
      "profesor",
      "alumno",
      "alumna",
      "profesora",
      "vecina",
      "cliente",
      "mascota",
    ],
    required: true,
  },
  categories: [
    {
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
      filters: [
        {
          filter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Filter",
            required: true,
          },
          selectedTags: [{ type: String }],
        },
      ],
    },
  ],
  gender: {
    type: String,
    enum: ["masculino", "femenino", "no-relevante"],
    required: true,
  },
  ageRange: {
    type: String,
    enum: ["bebé", "niño", "adolescente", "adulto", "anciano"],
    required: true,
  },

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  commentsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// PERSONA GUARDADA
const savedPersonSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  gender: Product.obj.gender,
  ageRange: Product.obj.ageRange,
  relation: {
    type: String,
    enum: [
      "madre",
      "padre",
      "hermana",
      "hermano",
      "hija",
      "hijo",
      "abuela",
      "abuelo",
      "tía",
      "tío",
      "prima",
      "primo",
      "amiga",
      "amigo",
      "sobrina",
      "sobrino",
      "pareja",
      "novia",
      "novio",
      "esposo",
      "esposa",
      "compañero de trabajo",
      "compañera de trabajo",
      "jefe",
      "jefa",
      "vecino",
      "profesor",
      "alumno",
      "alumna",
      "profesora",
      "vecina",
      "cliente",
      "mascota",
    ],
    required: true,
  },
  filters: [
    {
      filterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Filter",
        required: true,
      },
      tags: [{ type: String }],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

// USUARIO
const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: Product.obj.gender,
  birthday: { type: Date },
  profilePicture: { type: String, default: null },
  bio: { type: String, maxlength: 280 },
  tags: Product.obj.tags,

  favoriteProducts: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      type: { type: String, enum: ["self", "savedPerson"], default: "self" },
      relatedPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SavedPerson",
      },
    },
  ],

  savedPeople: [
    {
      name: { type: mongoose.Schema.Types.ObjectId, ref: "SavedPerson" },
      filters: { type: mongoose.Schema.Types.ObjectId, ref: "Filter" },
    },
  ],

  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["active", "inactive", "banned"],
    default: "active",
  },
});
```

### Controladores

- **UserController**: Maneja el registro, login, y obtención de usuarios. Permite la creación de cuentas, validación de credenciales y recuperación de información de usuarios registrados.
- **CategoryController**: CRUD de categorías, gestionando la creación, obtención, actualización y eliminación de categorías para los productos.
- **CommentController**: Administra los comentarios en los productos, permitiendo la creación, obtención y eliminación de comentarios.
- **FavoriteController**: Maneja los favoritos de los usuarios, permitiendo agregar, quitar y obtener productos favoritos para el usuario o para sus personas guardadas.
- **SavedPersonController**: Permite a los usuarios guardar personas (como amigos o familiares) para quienes podrían buscar regalos más adelante, cada uno con un conjunto de características determinadas editables.
- **ProductController**: CRUD de productos (crear, leer, actualizar, eliminar), gestionando todos los aspectos de los productos en la plataforma, incluidos los detalles y las imágenes.
- **FilterController**: CRUD de filtros, permitiendo la creación, modificación y eliminación de filtros que se utilizan en los productos y búsquedas.
- **SearchController**: Administra las búsquedas de productos, categorías o filtros, proporcionando resultados basados en los parámetros seleccionados por el usuario.
- **TagController**: Permite la gestión de etiquetas en los productos, facilitando la categorización por palabras clave para facilitar la búsqueda y organización.
