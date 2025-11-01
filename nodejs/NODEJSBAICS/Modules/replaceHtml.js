module.exports = function(template, product) {
    let output = template;

    output = output.replace("{{%IMAGE%}}", product.productImage );
    output = output.replace("{{%NAME%}}", product.name);
    output = output.replace("{{%MODELNAME%}}", product.modelName);
    output = output.replace("{{%MODELNO%}}", product.modelNumber);
    output = output.replace("{{%SIZE%}}", product.size);
    output = output.replace("{{%CAMERA%}}", product.Camera);
    output = output.replace("{{%PRICE%}}", product.price);
    output = output.replace("{{%COLOR%}}", product.color);
    output = output.replace("{{%ID%}}", product.id);
    output = output.replace("{{%ROM%}}", product.ROM);
    output = output.replace("{{%DESC%}}", product.Description);
    return (output);
}