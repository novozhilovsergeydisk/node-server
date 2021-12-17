'use strict';



// const routes = [
//     {
//         method: 'GET',
//         url: '/api/patients',
//         handler: patientController.getAllPatients
//     },
//     {
//         method: 'GET',
//         url: '/api/patients/:id',
//         handler: patientController.getPatient
//     },
//     {
//         method: 'POST',
//         url: '/api/patients',
//         handler: patientController.addPatient
//     },
//     {
//         method: 'PUT',
//         url: '/api/patients/:id',
//         handler: patientController.updatePatient
//     },
//     {
//         method: 'DELETE',
//         url: '/api/patients/:id',
//         handler: patientController.deletePatient
//     }
// ];

// class Router {
//     static findRoute(req, routes) {
//         const path = req.url;
//         const http_method = req.method;
//         let __route = {};
//
//         /*const pattern =/^\/$|^\/[a-z]+\/[a-z]+\/?$|^\/[a-z]+\/index\/?$|^\/[a-z]+\/show\/\d+$|^\/[a-z]+\/create\/?$|^\/[a-z]+\/edit\/\d+$|^\/[a-z]+\/update\/\d+$|^\/[a-z]+\/store\/?$|^\/[a-z]+\/destroy\/\d+$/g*/
//
//         const pattern =/^\/$|^\/[a-z_]+\/[a-z_]+\/?$|^\/$|^\/[a-z_]+\/[a-z_]+\/\d+$/g
//
//         let result = false;
//
//         if (path.match(pattern)) {
//             if (http_method === 'GET') {
//                 Object.keys(routes.get).forEach((route) => {
//                     // console.log({ 'path': path });
//                     // console.log({ 'route': route });
//
//                    if (path === route || path === route + '/') {
//                        result = { 'handler': routes.get[route].handler, 'action': routes.get[route].action };
//                    }
//
//
//                        // ? {'handler': routes.get[route].handler, 'action': routes.get[route].action} : false;
//
//                     // __route = { '__route': route };
//
//                     // console.log([{ 'path': path }, { 'route': route }, { 'result': result }]);
//
//                     // if (result) {
//                     //     console.log({ 'result inner findRoute': result });
//                     // }
//                 });
//             }
//
//             if (http_method === 'POST') {
//                 Object.keys(routes.post).forEach((route) => {
//                     result = (path === route || path === route + '/') ? {'handler': routes.post[route].handler, 'action': routes.get[route].action} : false;
//                 });
//             }
//         }
//
//         // console.log({ 'path': path, 'result': result });
//
//         return result;
//     }
// }
//
// module.exports = Router;