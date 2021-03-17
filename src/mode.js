arr1 = [
    't', 'e', 's', 't',
    'e', 'd', 'e', 's',
    'a', 'o', 'p', 'a',
    'u', 'l', 'o'
]
arr2 =[
    't', 'e', 's', 'o', 'd',
    'd', 'o', 'm', 'o', 'd',
    'e', 'i', 'n', 't', 'e',
    'r', 'l', 'a', 'g', 'o',
    's'
]

const result = [...Array(arr1.length).keys()].map(el => arr1[el] === arr2[el]);

console.log(result)