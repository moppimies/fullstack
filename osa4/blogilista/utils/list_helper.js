const lodash = require('lodash')

const dummy = blogs => {
    return 1
}

const totalLikes = blogs => {
    
    return blogs.reduce(
        (accumulator, current) => accumulator + current.likes, 0,
    );
}

const favoriteBlog = blogs => {
    
    return blogs.reduce(
        (accumulator, current) => {
            return current.likes > accumulator.likes ? current : accumulator;
        }
    );
}

const mostBlogs = blogs => {
    
    if (!blogs.length) {
        return []
    }

    const prt = lodash.countBy(blogs,'author')
    const arr = Object.values(prt)
    const max = Math.max(...arr)
    const index = arr.indexOf(max)

    const palautettava = {
        author: Object.getOwnPropertyNames(prt)[index],
        blogs: max
    }
    
    return palautettava
    
}

const mostLikes = blogs => {


    if (!blogs.length) {
        return []
    }
    
    const prt = lodash.map(blogs,'author')
    const authorShort = []
    prt.map((x) => {
        if (!authorShort.includes(x) ) {
            authorShort.push(x)
        }
        
    })

    const likesAuthor = new Array(authorShort.length).fill(0)
    
    blogs.map((x) => {
        const index  = authorShort.indexOf(x.author)
        likesAuthor[index] = x.likes + likesAuthor[index] 
    }) // tässä muodostetaan samalla indekillä oleva taulukko, kuin "prt", näin saadaan ulos samalla indeksillä tykkäykset ja "authorit"
    
    const mostLikes = Math.max(...likesAuthor)
    const index = likesAuthor.indexOf(mostLikes)
    const toBeReturned = {
        author: authorShort[index],
        likes: mostLikes
    }
    
    return toBeReturned

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}