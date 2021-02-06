//Logica do modal
const Modal = {
  openClose() {
    //Abrir modal
    document.querySelector(".modal-overlay").classList.toggle("active");
    //.add('active')

    // adicione a classe active ao modal
  },
  //segunda forma de se fazer
  /*close(){
      //Fechar o modal
      document.querySelector('.modal-overlay')
      .classList
      .remove('active')

      //Remove classe active do modal
    }*/
};

//Salvando os dados no Storage do navegador

const Storage={
  get(){
    return JSON.parse(localStorage.getItem("season.finances:transactions")) || []
  },
  set(transactions){
    localStorage.setItem("season.finances:transactions",JSON.stringify(transactions))
  }
}


//Logica de Transação

const Transaction = {
  //precisamos pegar todas Transaçãoes feitas na web page e trasforma-las em uma lista para manipular seus valores
  all: Storage.get(),

  add(transaction){

    Transaction.all.push(transaction)

    App.reload()
  },
  remove(index){
    Transaction.all.splice(index,1) //remova o index  1=um elemento
    App.reload()
  },
/*Eu preciso somar todas entradas e saidas, pegar o valor delas assim terei o Total*/
  incomes() {
    
    let income=0;
    //pegar todas transactions
    Transaction.all.forEach(transaction=>{
        //para cada transactions se ela for maior que 0 adicione a variavel
        if(transaction.amount>0){
          income+=transaction.amount

        }
       
    })
    
    
    return income;
  },
  expenses() {
    //somar as Sádas
    let expense=0
    Transaction.all.forEach(transaction=>{
        if(transaction.amount<0){
          expense+=transaction.amount

        }
    })

    return expense
  },
  total() {
    //total=(entradas-saídas)
    
    
    
    return Transaction.incomes() + Transaction.expenses()
  }
};


// Preciso pegar as transactions feitas aqui no js e colocar la na page html  "Substituir"

const DOM ={
    transactionsContainer:document.querySelector('#data-table tbody'),

    addTransaction(transaction,index){
        
        
        const tr=document.createElement('tr')
        tr.innerHTML= DOM.innerHTMLTransaction(transaction,index)
        DOM.transactionsContainer.appendChild(tr)
        tr.dataset.index=index
       
    },
   innerHTMLTransaction(transaction,index){
       // var de troca de cores se o dinheiro for maior q 0 classe income, se nao expense
        const CSSclass=transaction.amount >0 ?"income" :"expense"
        //formatação da moeda
        const amount= Utils.formatCurrency(transaction.amount)

       const html=`
    
       <td class="description">${transaction.description}</td>
       <td class="${CSSclass}">${amount}</td>
       <td class="date">${transaction.date}</td>
       <td >
       <img onclick="Transaction.remove(${index})"src="./assets/minus.svg" alt="Remover Transação">
       </td>

       `
       return html
   },
   updateBalance(){
       document.getElementById('incomeDisplay')
       .innerHTML=  Utils.formatCurrency(Transaction.incomes())
      

       document.getElementById('expenseDisplay')
       .innerHTML=Utils.formatCurrency(Transaction.expenses())

       document.getElementById('totalDisplay')
       .innerHTML=  Utils.formatCurrency(Transaction.total())
   },
   clearTransactions(){
     DOM.transactionsContainer.innerHTML= ""
   }
}



//ultilidades tais como formatação dos valores

const Utils={
    formatDate(date){
      const splittedDate=date.split("-")
      return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`

    },
    formatAmount(value){
      value=value*100
      return Math.round(value)
    },

    formatCurrency(value){
        const signal=Number(value) < 0 ?"-" :""

        value=String(value).replace(/\D/g,"")

        value=Number(value)/ 100

        value=value.toLocaleString("pt-BR",{
            style:"currency",
            currency:"BRL"
        })

        return signal+ value
        
    }
}
//Logica do Formulario
const Form={
  description:document.querySelector('input#description'),
  amount:document.querySelector('input#amount'),
  date:document.querySelector('input#date'),
  //pegando somente os valores
  getValues(){
    return{
      description:Form.description.value,
      amount :Form.amount.value,
      date:Form.date.value
    }
  },
  validateFields(){
    //destructring
    const {description,amount,date}=Form.getValues()//desestruturamos o array de valores e colocamos nessa const{desc,amou,dat}
    //metodo trim faz um a limpesa olhando se tem algo no vazio
    if(description.trim()==="" || date.trim()==="" || amount.trim()===""){
      throw new Error("Por favor, preencha todos os campos")
    }

  },
  formatValues(){
    let {description,amount,date}=Form.getValues()
    amount=Utils.formatAmount(amount)
    console.log(amount)

    date=Utils.formatDate(date)
    return{
      description,
      date,
      amount

    }
    
  },
  clearFields(){
    Form.description.value= ""
    Form.amount.value= ""
    Form.date.value= ""
  },
 
  submit(event){
     //pare a funcionalide padrao para nao aparecer nada no browser
     event.preventDefault()

     //tente fazer isso
    try {

    //verificar se todas as informaçoes foram preenchidas
    Form.validateFields()


    //formatar os dados para salvar
    const transaction=Form.formatValues()
    //salvar
    Transaction.add(transaction)

    //apagar os dados do Formulario
    Form.clearFields()

    //modal feche
    Modal.openClose()
    
      
    } catch (error) {
      alert(error.message)
    }

    
  }
}


const App={
  init(){
 //tecnina para adcionar a dom automaticamnete 
Transaction.all.forEach((transaction,index)=>{
  DOM.addTransaction(transaction,index)

})

DOM.updateBalance()
Storage.set(Transaction.all)


  },
  reload(){
    DOM.clearTransactions()
    App.init()

  }
}

//===================================Chmadas Ultima estrutura============================
App.init()
//FUNCIONALIDADE DE ADD

