**ENDPOINT LIST**

get Images List

-> GET https://expressjs-production-387b.up.railway.app/api/v1/images

add Image (upload)

-> POST https://expressjs-production-387b.up.railway.app/api/v1/images/upload

-> BODY : file(image), judul(string), deskripsi(string)

get Image detail

-> GET https://expressjs-production-387b.up.railway.app/api/v1/images/:id

edit judul & deskripsi

-> PUT https://expressjs-production-387b.up.railway.app/api/v1/images/:id

-> BODY : judul(string), deskripsi(string)

delete Image

-> DELETE https://expressjs-production-387b.up.railway.app/api/v1/images/:id

**Link Deploy Url : https://expressjs-production-387b.up.railway.app**
