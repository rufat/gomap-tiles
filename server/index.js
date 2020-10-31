const fs = require('fs');
const express = require('express')
const app = express()
const port = 3303

app.get('/', (req, res) => {
    res.send('Xəritə serveri işləkdir. ☺️')
})

app.get('/map/:x/:y/:z', (req, res) => {
    try {
        const options = {
            root: __dirname + '/tiles', // [!] Bu qovluq adresini öz qovluq strukturuna görə dəyişdirin.
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        }

        const coord = req.params
        if (coord.z < 11 && coord.z > 13) return res.json({ success: false, err: "Yaxınlaşdırma limiti sərhədi keçdi. Yaxınlaşdıra bilmə aralığı: 9 - 14" }); // Zoom dəyərinin limit keçməməsinə baxırıq.
        res.sendFile(`${coord.z}/${coord.x}/${coord.y}.png`, options, function (err) { // Mövcud tile qovluq strukturu ilə X, Y, Z üzrə uyğun tile-ı tapıb göndəririk.
            if (err) {
                console.log(err);
                return res.json({ success: false, err: "Xəritə hissəsi tapılmadı. Buraya JSON cavabı əvəzinə xəritədə göstərmək üçün 'placeholder tile' şəkili yerləşdirə bilərsiniz." })
            }
        })
    } catch (ex) {
        console.log(ex);
        res.json({success: false, err: ex.toString()})
    }
})

app.get('*', (req, res) => {
    res.json({success: false, err: "Yanlış URL adresi. Xəritə üçün /map/{x}/{y}/{z} URL formatından istifadə edin."})
})

app.listen(port, () => {
     console.log(`Xəritə serveri http://localhost:${port} üzərindən işləkdir.`)
})
