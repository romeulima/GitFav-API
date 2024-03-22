import { Github } from "./github.js"

export class Favorites{
    constructor(root){
        this.root = document.querySelector(root)
        this.load()
    }

    async add(username){
        try{       
            
            const userExist = this.users.find(user => user.login === username)

            if(userExist){
                throw new Error('Usuário já está favoritado')
            } 
            
            const user = await Github.search(username)

            if(user.login === undefined){
                throw new Error('Usuário não encontrado!')
            }

            this.users = [user, ...this.users]
            this.upload()
            this.save()

        } catch(error){
            alert(error.message)
        }
    }

    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.users))
    }

    load(){
        this.users = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    delete(entry){
        const filteredUsers = this.users.filter(user => user.login !== entry.login)
        this.users = filteredUsers
        
        this.upload()
        this.save()
    }
}

export class FavoritesView extends Favorites{
    constructor(root){
        super(root)
        this.tbody = document.querySelector('table tbody')
        this.upload()
        this.onAdd()
    }

    onAdd(){
        const searchButton = this.root.querySelector('.search-wrapper button')
        searchButton.onclick = () => {
            const { value } = this.root.querySelector('.search-wrapper input')
            this.add(value)
        }
    }

    upload(){
        this.removeAllTr()

        this.users.forEach((user) => {
            const row = this.createRow()
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user a p').textContent = user.name
            row.querySelector('.user a span').textContent = `/${user.login}`
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            const removeButton = row.querySelector('td .remove')

            removeButton.onclick = () => {
                const isOk = confirm('Você realmente deseja remover esse Usuário?')
                if(isOk){
                    this.delete(user)
                    return
                }
            }

            this.tbody.append(row)
        })

        if(this.users.length === 0){
            document.querySelector('div.empty-favorites').classList.remove('hide')
        }else{
            document.querySelector('div.empty-favorites').classList.add('hide')
        }
    }
    
    createRow(){
        const tr = document.createElement('tr')

        tr.innerHTML = `
        <td class="user">
            <img src="https://github.com/maykbrito.png" alt="Imagem do Usuário">
            <a href="https://github.com/maykbrito" target="_blank">
                <p>Mayk Brito</p>
                <span>/maykbrito</span>
            </a>
        </td>
        <td class="repositories">123</td>
        <td class="followers">1234</td>
        <td><button class="remove">Remover</button></td>
        `
        return tr
    
    }

    removeAllTr(){
        const tr = this.tbody.querySelectorAll('tr')
        tr.forEach(tr => tr.remove())
    }

    
}