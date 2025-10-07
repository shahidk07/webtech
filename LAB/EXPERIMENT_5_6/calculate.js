const express= require('express');
const app=express();
const port=100;
app.get('/calculate',(req,res)=>{
    const {operation,num1,num2} =req.query;
    const n1 =parseFloat(num1);
    const n2=parseFloat(num2);

    let result;
    switch(operation){
        case 'add':
            result =n1+n2;
            break;
            case 'subtract':
                result=n1-n2;
                break;
                case 'multiply':
                    result = n1*n2;
                    break;
                    case 'divide':
                        result=n2!==0?n1/n2:'ERROR:DIVISION BY ZERO';
                        break;
                        default:
                            result='ERROR:Invalid Operation';
    }
    res.send(result)
})
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });