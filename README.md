Escuela de Programación - JavaScript B2 
# Ejercicio Final 
# Introducción 
Este ejercicio práctico cubre todos los contenidos que se han ido aprendiendo a lo largo de los diferentes temas del curso, si bien su resolución no implica el uso de código relativo a todos ellos, algunos de los cuales han sido cubiertos de forma específica en los ejercicios anteriores.  
# Práctica. Aplicación web de anotaciones 
1. ## Objetivo 
El principal objetivo de este ejercicio es implementar una aplicación web que permite crear anotaciones en un dispositivo de forma persistente, haciendo uso para solventar dicha persistencia de la API LocalStorage   

La creación de notas se hará de forma estructurada, a través de diferentes tipos de bloques que el usuario podrá ir incluyendo para conformar la anotación en su conjunto. 
2. ## Tipos de bloques 
Como hemos comentado, la aplicación permitirá crear notas a través del uso de bloques predefinidos para soportar diferentes tipos de contenidos. Esto nos permite dos cosas: 

- Por un lado, evitar el trabajo con selecciones de texto que tiene su propia complejidad. 
- Por otro lado, crear una modelo fácilmente extensible, pudiendo ir añadiendo tipos de bloques en el futuro para soportar nuevos tipos de contenidos. 

Cada tipo de bloque podrá contar con algunas propiedades configurables a la hora de insertarlo o editarlo, como se verá al definir cada uno de ellos, y todos dispondrán de una funcionalidad común relativa a su integración y comportamiento dentro del contexto de una nota. 

Los diferentes tipos de bloque que nuestra aplicación soportará de forma inicial son: 

- Heading 
- Paragraph 
- Image 
1. ### Funcionalidad común a todos los Bloques 
Como decíamos, aunque cada bloque tendrá una configuración específica en función de su naturaleza, hay una serie de propiedades y funcionalidades que son compartidas por todos ellos:  



|Propiedades ||Descripción |
| - | :- | - |
|type ||Indica el tipo de bloque, puede ser un valor de entre: heading, paragraph o image. |
|content ||Esta propiedad guardará el contenido del bloque en formato texto, independientemente de su tipo. Para el caso de las imágenes trabajaremos en base64 para poder hacerlo. |
|Métodos ||Descripción |
|render()||Este método devuelve el código HTML correspondiente al render del bloque en base a su contenido, valor de sus propiedades, etc.  |
|parse(jsonBlock)||Este método parsea la cadena de texto con formato JSON  contenida en el parámetro |
|||<p>jsonBlock de manera que carga y configura el bloque a partir de dicha información. </p><p>Este método lo primero que debe validar es que </p>|
|||<p>el tipo recibido en jsonBlock corresponde con el tipo de bloque de la instancia.  </p><p>Si no corresponde debe arrojar un error, pero si es correcto debe tomar los valores de las propiedades correspondientes y cargarlas en las propiedades del bloque. </p><p>Hay que tener en cuenta que, en el caso de la imagen, el contenido ha de estar en base64. </p>|
|plain()||<p>Este método convierte la instancia de bloque en su versión de cadena de texto para poder ser almacenada de forma persistente.  </p><p>Hay que tener en cuenta que en el caso de la imagen el contenido ha de estar en base64.  </p>|

La estructura de datos diseñada para guardar los diferentes bloques es la siguiente, ejemplificada para todos los tipos de contenido diferentes:  

{ ![](Aspose.Words.9a7d25bd-aa86-4036-98d1-d17bed496bb3.001.png)

type: “heading”,

content: “Hello world!”,

config: { 

level: 1, 

color: 000000 

} 

} 

{ ![](Aspose.Words.9a7d25bd-aa86-4036-98d1-d17bed496bb3.002.png)

type: “paragraph”,

content: “This is awesome.”, 

config: { 

highlight: false 

} 

} 

{ ![](Aspose.Words.9a7d25bd-aa86-4036-98d1-d17bed496bb3.003.png)

type: “image”,

content: “data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmoAAAJqCAMAA ACsDJxNAAADAFBMVEVHcEwAAAB6bxcAAAAeHAUmIwawoR366CqloiVUTg4oJ QZSTA5jWxAbGwQAAABrZBIBAQAXFQMzLwllXhEfHAZ1axI3MwkAAABAOwpcV Q90axVwaRMAAABIQgxZUg8AAABmXxE9OQovKwcAAABLRQwAAAB4bhUDAwBtZ BJKRQwAAABDPgsAAAAAAABvZxMAAAD...more data here... UAAAAAElFTkSuQmCC”, 

config: { 

units: px, 

max-width: 320, 

} 

} 

Hay una parte común a todos los bloques que es type y content, pero luego está el nodo config que será diferente en función de cada tipo de bloque. 
2. ### Bloque Heading 
Este tipo de bloque está pensado para titulares, tendrá sus propios estilos asociados mediante clases de CSS que se asignan a partir del valor de las propiedades configurables.  



|Propiedades del bloque Heading ||
| - | :- |
|level |<p>Es el nivel de encabezamiento, permitiendo 3 cada uno de los cuales tendrá una visualización más o menos relevante, de manera que el nivel 1 es el heading de primer nivel (más relevante) y el nivel 3 es el heading de tercer nivel (menos relevante) </p><p>El valor por defecto para esta propiedad es 1. </p>|
|color |<p>Admitiría un valor hexadecimal de 6 caracteres (a validar) y sería el color que se aplicaría al bloque. </p><p>Su valor por defecto es 000000 que equivale al negro. </p>|
3. ### Bloque Paragraph 
Este tipo de bloque está pensado para párrafos de texto. Su estilo se tomará a partir de la clase de CSS correspondiente, aunque podrá tener variaciones dependiendo de sus propiedades.  
#### 02\.03.01. Modo dictado 
Este bloque permite introducir su texto empleando la API Speech to Text [^1] de los navegadores, de manera que el usuario podrá introducir el texto manualmente a través del uso del teclado o elegir el modo dictado de voz, de manera que el sistema transcribe el audio mediante dicha API. 



|Propiedades del bloque Paragraph ||
| - | :- |
|highlight|<p>Esta propiedad es de tipo booleano, pudiendo tener valores true </p><p>o false. Cuando un párrafo es highlight, se le aplicará una clase adicional que modificará su aspecto visual. </p>|



||El valor por defecto para esta propiedad es false. |
| :- | - |
4. ### Bloque Image 
Este tipo de bloque está pensado para contener una imagen en su interior. El estilo se tomará a partir de la clase de CSS correspondiente, aunque podrá tener variaciones dependiendo de sus propiedades.  

El estilo para las imágenes ha de ser de un ancho (propiedad width) del 100% y un alto automático proporcional al ancho (es decir, valor auto en la propiedad height). De esta forma se comportan como imágenes responsive ocupando todo el ancho disponible y mostrándose proporcionalmente en alto. 

Es importante entender que la imagen en ningún momento se envía al servidor ni se almacena como fichero, sino que se toma del sistema de archivos local para obtenerla en formato base64 y a partir de ese momento siempre se maneja en dicho formato. 



|Propiedades del bloque Im age ||
| - | :- |
|upscale |<p>Esta propiedad indica si la imagen se ha escalar para ocupar todo el ancho disponible o si, por el contrario, su ancho máximo ha de ser su ancho original.  </p><p>Su valor es booleano (true o false) y por defecto es true. </p><p>En función de su valor cambiará la forma de tratar la propiedad max-width. </p>|
|units |<p>Esta propiedad indica las unidades empleadas para las dimensiones de la imagen, puede tener solamente dos posibles valores: px o % </p><p>El valor por defecto es %. </p>|
|max-width |<p>Esta propiedad es de tipo numérico y corresponde al valor del ancho máximo de la imagen en las unidades indicadas por units. En el caso de que las unidades sean %, su valor máximo </p><p>es 100. </p><p>El valor por defecto: </p><p>-  auto si el valor de upscale es false.  </p>|



||<p>-  100 si upscale es true y units % </p><p>En otro caso no tiene valor por defecto, sino que sería requerido y tomaría el valor indicado. </p>|
| :- | - |
#### 02\.04.01. Formato, carga y guardado de imagen 
Como hemos dicho, las imágenes se usarán en su versión en base64, tanto para mostrarse mediante el atributo src de la etiqueta img, como al guardarse.  

Los formatos admitidos serán jpeg, gif y png. 

Debido a las limitaciones del sistema empleado para la persistencia de datos, no se admitirán imágenes de más de 300kb de peso, por lo que se ha de hacer esa validación al cargarla. 

Para la carga de imágenes del sistema de archivos local se hará uso de Filereader [^2], dentro de File API [^3], que permite obtener el valor en base64 del recurso elegido por el usuario, así como disponer de información del peso del archivo seleccionado.  
3. ## Sistema de notas 
Nuestra aplicación permitirá gestionar diferentes notas y cada nota estará compuesta por una serie de bloques a los que se les asigna un orden concreto. Para ello la aplicación debe permitir: 

1. Listar notas actuales o, si aún no hay ninguna, un mensaje indicando que no hay notas, junto a un botón “call to action” para comenzar creando la primera. 
1. Crear una nueva nota, para lo que se pedirá un nombre y posteriormente se irá a la pantalla de edición de la misma con ella vacía. 
1. Editar una nota existente, que nos llevará a la pantalla de edición de la misma con el contenido que le corresponde cargado desde el sistema de almacenamiento persistente.  
1. Eliminar una nota existente. 

Veremos con detenimiento cada una de estas funcionalidades en los siguientes puntos. 
1. ### Notas 
Las notas son contenedores de bloques en un orden dado, son la entidad principal de nuestra aplicación en torno a la que girarán las demás.  



|Propiedades ||Descripción |
| - | :- | - |
|id ||<p>Es un id único con formato note\_XX donde XX es un número autoincremental que se va generando a raíz de interactuar con la aplicación.  </p><p>Una nueva nota tendrá como id el siguiente al último disponible.  </p><p>Este id se usará para acceder al contenido de la nota en operaciones como editar, eliminar o guardar.  </p>|
|name ||Es el nombre de la nota que se usará para identificarla en los listados, etc. |
|date\_created||Este campo contiene la fecha y hora de creación de la nota. |
|date\_updated||Este campo contiene la fecha y hora de la última edición de la nota. |
|blocks ||Esta propiedad contiene la lista de bloques que conforman la nota, en el orden en el que se han de mostrar. |
|Métodos ||Descripción |
|addBlock(block, position)||Este método añade el bloque recibido como parámetro a la nota actual, en la posición especificada como parámetro.  |
|removeBlock(position)||Este método elimina un bloque de la nota actual a partir de la posición especificada como parámetro.  |
|parse(jsonNote)||Este método parsea una cadena de texto en formato JSON para cargar todos los contenidos a partir del mismo.  |
|plain()||Este método devuelve la versión en cadena de texto para la nota completa, se recomienda hacer |



||uso del formato JSON para ello. |
| :- | - |
|render()|Este método devuelve la representación en HTML de la nota completa a partir de sus respectivos bloques, etc.  |

El formato generado por plain() para una nota que contenga 3 bloques, uno de cada tipo, podría ser el siguiente (el orden de los bloques va implícito en el orden del propio array blocks): 

{ ![](Aspose.Words.9a7d25bd-aa86-4036-98d1-d17bed496bb3.004.png)

id: “note\_1”,

name: “Testing note :)”,

date\_created: “2024-06-08”,

date\_updated: “2024-06-10”,

blocks: [ 

{ 

type: “heading”,

content: “Hello world!”,

config: { 

level: 1, 

color: 000000 

} 

}, { 

type: “paragraph”,

content: “This is awesome.”, 

config: { 

highlight: false 

} 

}, { 

type: “image”,

content: “data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmoAAAJqCAMAA ACsDJxNAAADAFBMVEVHcEwAAAB6bxcAAAAeHAUmIwawoR366CqloiVUTg4oJ QZSTA5jWxAbGwQAAABrZBIBAQAXFQMzLwllXhEfHAZ1axI3MwkAAABAOwpcV Q90axVwaRMAAABIQgxZUg8AAABmXxE9OQovKwcAAABLRQwAAAB4bhUDAwBtZ BJKRQwAAABDPgsAAAAAAABvZxMAAAD...more data here... UAAAAAElFTkSuQmCC”, 

config: { ![](Aspose.Words.9a7d25bd-aa86-4036-98d1-d17bed496bb3.005.png)

units: px, 

max-width: 640, 

} 

} 

] 

} 
2. ### Listado de notas  
Nuestra aplicación web tendrá una estructura muy sencilla como se puede apreciar en la siguiente captura:  

![](Aspose.Words.9a7d25bd-aa86-4036-98d1-d17bed496bb3.006.png)

El listado de notas simplemente mostrará un listado de todas las notas disponibles almacenadas de forma persistente, mostrando para cada una de ellas su campo name y date\_updated, así como un icono para eliminarlas. 

Las notas se mostrarán ordenadas por dicha fecha de actualización de más recientes a más antiguas. 

Pulsando sobre cualquier de las notas, accederemos a la edición de la misma, y pulsando sobre el icono de eliminar de una de ellas iremos a la pantalla de confirmación de la acción como se describe más adelante. 

Finalmente, el listado dispondrá de un botón o icono que permitirá crear una nueva nota desde cero que se añadirá a la lista actual. 
3. ### Nueva nota 
Como hemos comentado, desde el listado de notas podremos crear una nueva nota vacía. Esto se realizará en una pantalla dedicada a ello que contará con una estructura similar a la de la imagen: 

![](Aspose.Words.9a7d25bd-aa86-4036-98d1-d17bed496bb3.007.png)

Como podemos ver la pantalla permite: 

- Asignar / editar el nombre pulsando sobre el mismo (obligatorio en este caso de nueva nota al guardar). 
- Añadir un bloque de tipo heading, texto o imagen en la posición actual. 
- Editar cualquier bloque disponible en la nota, pulsando sobre el mismo. 
- Reordenar los bloques arrastrando los mismos. 
- Guardar nota o descartar cambios (desde el botón de los 3 puntos de la cabecera). 

Cuando se pulsa un bloque y se va a la edición del mismo, esto se mostrará en un “action sheet” similar a las que se pueden ver en las siguientes imágenes: 

![](Aspose.Words.9a7d25bd-aa86-4036-98d1-d17bed496bb3.008.png) ![](Aspose.Words.9a7d25bd-aa86-4036-98d1-d17bed496bb3.009.png)

Los elementos editables de cada tipo de bloque vienen definidos precisamente en el punto 02. Tipos de bloques. Al igual que con la nota, la edición de un bloque permitirá guardar los cambios o descartarlos. 
4. ### Editar nota 
Esta pantalla en el fondo es la misma que la de nueva nota, pero con la diferencia que aparece con el contenido disponible ya precargado, así como el nombre, id, etc. Permite exactamente las mismas acciones que 03.03. Nueva nota. 

El único cambio es que cuando la nota no es nueva, se incluye una opción adicional que es eliminar nota (no disponible en nueva nota, ya que sería lo mismo que descartar cambios). 
5. ### Eliminar nota 
Como decíamos, una nota se puede eliminar desde el listado principal o desde la pantalla de edición de nota. En ambos casos, se mostrará una alerta al usuario para que confirme la eliminación indicando el nombre de la nota que va a eliminar.  

![](Aspose.Words.9a7d25bd-aa86-4036-98d1-d17bed496bb3.010.png)

Esta pantalla dispone de 2 botones para CANCELAR y ELIMINAR. 

Cancelar aborta la eliminación de la nota, y eliminar la confirma y, por tanto, borra la nota definitivamente tanto de memoria como del sistema persistente. 
6. ### Estructura de la aplicación 
Es importante entender que no crearemos una aplicación con diferentes páginas HTML, sino que todo se desarrollará en la misma. Para ella tendremos dentro de nuestro código HTML diferentes nodos que serán cada pantalla completa, y la aplicación principal será la encargada de mostrar la pantalla que corresponda en función de las selecciones e interacción del usuario.  

De esta manera podemos permitirnos algunas licencias que simplifican el desarrollo del ejercicio, como cargar de inicio todas las notas disponibles en nuestro sistema de almacenamiento persistente y trabajar con ellas en una estructura de datos más manejable en memoria, actualizando la versión persistente cuando haya cambios.  

Esto también nos permite no perder información en los cambios de página, que de otra manera habría que mantenerla guardada en sesión para poder recuperarla con el cambio de dichas páginas. 
4. ## Organización, código y buenas prácticas 
El ejercicio se ha de realizar haciendo uso de módulos (export / import) y clases.  Se aconseja disponer al menos de las siguientes clases: 

- App como aplicación principal que maneja las diferentes pantallas 
- StorageAPI para la gestión de carga y guardado de notas 
- Note para la gestión de una nota a nivel puramente de información 
- NoteList para la gestión de la pantalla de listado de notas 
- NoteDetail para la gestión de la pantalla de creación / edición de notas 
- NoteDelete para la gestión de la pantalla de borrado de notas 
- Block como clase padre con funcionalidad común a todos los bloques 
- BlockHeading como clase para gestionar los headings. Extiende Block 
- BlockParagraph como clase para gestionar los párrafos. Extiende Block  
- BlockImage como clase para gestionar las imágenes. Extiende Block 

Lógicamente, también se podría tener una clase para las pantallas de edición de cada tipo de bloque, etc.  

Siempre que se pueda se debe hacer uso de características modernas del lenguaje, por ejemplo: 

- Uso de cadenas templates literals [^4] para el renderizado de estructuras HTML complejas. 
- Uso de métodos avanzados de array como filter, reduce, map, find, includes, forEach, etc., para tareas como evitar duplicados, iteración por listados, etc.  
- Uso de custom events [^5] para la comunicación entre clases si fuera necesario.  
- Uso de try - catch - finally para el manejo y control de errores y excepciones. 

[^1]: <https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API>  
[^2]: <https://developer.mozilla.org/en-US/docs/Web/API/FileReader>  
[^3]: <https://developer.mozilla.org/en-US/docs/Web/API/File_API>  
[^4]: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals>  
[^5]: <https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent>  
