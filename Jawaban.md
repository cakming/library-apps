# Mirza Eka
## Jawaban 1
```
/**
 * #1 temukan nilai max dari [1, 5, 8, 0, 9, 7, 4, 3, 2]
 * @param Array input - Array of integers
 * @return integer
 */
function findMax (input) {
  let maxVal = 0

  input.forEach(val => {
    if (Number.isInteger(val)) {
        maxVal = (val > maxVal) ? val : maxVal
    }
  })

  return maxVal
}
```
## Jawaban 2
```
/**
 * #2 0 - 100
 * Setiap kelipatan 25 akan mencetak string “KI”
 * Setiap keliaptan 40 akan mencetak string “OS”
 * Setiap kelipatan 60 akan mencetak string “TIK”
 * Dan setiap kelipatan 99 akan mencetak string “KIOSTIX”
 * @param integer loopStart - start loop from
 * @param integer loopEnd - end loop at
 * @return string
 */
function printString (loopStart = 0, loopEnd = 100)
{
  let output = ''
  for (loopStart; loopStart <= loopEnd; loopStart++) {
    let plusOne = loopStart + 1
    if (plusOne % 25 === 0) {
      output += 'KI'
    }
    if (plusOne % 40 === 0) {
      output += 'OS'
    }
    if (plusOne % 60 === 0) {
      output += 'TIK'
    }
    if (plusOne % 99 === 0) {
      output += 'KIOSTIX'
    }
  }
  return output
}
```
## Jawaban 3
```
/**
 * #3 deteksi sebuah kata Palindrom
 * @param String input
 * @return boolean
 */
function isPalindrom(input = '') {
  const length = input.length
  input = input.toLowerCase()

  for (let x = 0; x < length / 2; x++) {
    if (input[x] !== input[length - 1 - x]) {
      return false;
    }
  }

  return true;
}
```

## Jawaban 4 - Tabel Design
![ERD](https://i.ibb.co/vvn73PH/mirza.jpg)

## Jawaban 5
```
SELECT buku.* FROM buku
INNER JOIN penulis
ON buku.penulis_id = penulis.id
WHERE penulis.nama_penulis = '${namaPenulis}'
```

## Jawaban 6
```
SELECT buku.*, penulis.nama_penulis FROM buku
INNER JOIN penulis
ON buku.penulis_id = penulis.id
INNER JOIN kategori
ON buku.kategori_id = kategori.id
WHERE kategori.nama_kategori = '${namaKategori}'
```

## Jawaban 7
### Find Books by Book Title
#### Endpoint
```
GET /api/buku/by-title/{judul}
```
#### Params
| Parameter | Is Required | Description |
| ----------- | ----------- | ----------- |
| judul      | yes       | Judul buku |

#### Response
```
{
    [
        {
            "id":1,
            "nama_buku":"Membuat Paludarium",
            "kategori_id":1,
            "penulis_id":1,
            "jumlah_halaman":76,
            "url_sampul":null,
            "tahun_terbit":2005,
            "created_at":"2021-08-01T16:17:47.000Z",
            "updated_at":"2021-08-01T16:17:47.000Z"
        },
        ...
    ]
}
```

## Jawaban 8
### Find Books by Author Name
#### Endpoint
```
GET /api/buku/by-author/{nama}
```
### Params
| Parameter | Is Required | Description |
| ----------- | ----------- | ----------- |
| nama      | yes       | Nama penulis |

### Response
```
{
    [
        {
            "id":1,
            "nama_buku":"Membuat Paludarium",
            "kategori_id":1,
            "penulis_id":1,
            "jumlah_halaman":76,
            "url_sampul":null,
            "tahun_terbit":2005,
            "created_at":"2021-08-01T16:17:47.000Z",
            "updated_at":"2021-08-01T16:17:47.000Z"
        },
        ...
    ]
}
```

## Jawaban 9
### Find Books by Category
#### Endpoint
```
GET /api/buku/by-category/{kategori}
```
#### Params
| Parameter | Is Required | Description |
| ----------- | ----------- | ----------- |
| kategori      | yes       | Nama kategori |

#### Response
```
{
    [
        {
            "id":1,
            "nama_buku":"Membuat Paludarium",
            "kategori_id":1,
            "penulis_id":1,
            "jumlah_halaman":76,
            "url_sampul":null,
            "tahun_terbit":2005,
            "created_at":"2021-08-01T16:17:47.000Z",
            "updated_at":"2021-08-01T16:17:47.000Z",
            "nama_penulis":"Irwansyah"
        },
        ...
    ]
}
```
