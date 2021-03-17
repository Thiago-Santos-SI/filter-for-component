var nome = "2019 (Sao Paulo)";
var nome2 = nome.replace(/[^a-zA-Zs]/g, "")

let arr = [
    'auto de sao paulo',
]


function remover_acentos_espaco(str) {
    return str.normalize("NFD").replace(/[^a-zA-Zs]/g, "").toLowerCase()
}

const res = remover_acentos_espaco('Autódromo de Interlagos')

let arrStr = []

for (let i = 0; i < res.length; i++) {
    let c = res.charAt(i);
    arrStr.push(c)
}

arr.map((string, index) => {

    const arrayString = []

    const stringFormatted = remover_acentos_espaco(string)

    for (let i = 0; i < stringFormatted.length; i++)    {
        let c = stringFormatted.charAt(i);

         arrayString.push(c)

    }

    const result = [...Array(arrStr.length).keys()].map(el => arrStr[el] === arrayString[el]);

    console.log(string);

    if (result[0] && result[1] && result[2] && result[3] && result[4]){

    }




    let arrBool = []

    arrStr.map((characters, i) => {

        arrayString.map((lyrics,index) => {
            const checkCharacters = lyrics === characters && index === i

            if (checkCharacters) {
                arrBool.push(checkCharacters)
            }

        })
    })

    console.log(arrBool)


})

for (let i = 0; i < res.length; i++) {
    let c = res.charAt(i);
    //console.log(c);
}
