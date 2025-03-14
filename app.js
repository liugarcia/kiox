        // Define a data atual no campo de data
        const dataInput = document.getElementById("data");
        if (dataInput) {
            dataInput.value = new Date().toLocaleString("pt-BR");
        }

        // Função para calcular o total
        function calcularTotal() {
            let total = 0;
            const valores = document.querySelectorAll("#servicos input[type='number']");
            valores.forEach(input => {
                const valor = parseFloat(input.value);
                if (!isNaN(valor)) {
                    total += valor;
                }
            });
            const totalElement = document.getElementById("total");
            if (totalElement) {
                totalElement.textContent = `R$ ${total.toFixed(2)}`;
            }
        }

        // Função para garantir que apenas uma opção seja selecionada por linha
        function garantirSelecaoUnica(event) {
            const checkbox = event.target;
            const linha = checkbox.closest('tr'); // Encontra a linha (tr) do checkbox clicado

            // Seleciona todos os checkboxes da mesma linha com o nome "opcao"
            const checkboxes = linha.querySelectorAll('input[type="checkbox"][name="opcao"]');

            // Se o checkbox atual foi marcado, desmarca os outros da mesma linha
            if (checkbox.checked) {
                checkboxes.forEach(cb => {
                    if (cb !== checkbox) {
                        cb.checked = false;
                    }
                });
            }
        }

        // Adiciona o evento de mudança aos checkboxes
        const checkboxes = document.querySelectorAll('input[type="checkbox"][name="opcao"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', garantirSelecaoUnica);
        });

        // Função para salvar o PDF
        async function salvarPDF() {
            const { jsPDF } = window.jspdf;

            // Cria um novo PDF
            const doc = new jsPDF('p', 'mm', 'a4');

            // Define a largura máxima do conteúdo (mesma largura do container)
            const maxWidth = 190; // Largura máxima em mm (equivalente a 800px)

            // Adiciona a logo no lado esquerdo
            const logoUrl = "https://i.postimg.cc/9QCbxyf4/Picsart-25-02-26-15-48-41-494.png";
            const logoWidth = 30; // Largura da logo
            const logoHeight = 30; // Altura da logo
            doc.addImage(logoUrl, 'PNG', 10, 10, logoWidth, logoHeight);

            // Adiciona os dados da oficina no lado direito
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0); // Preto
            doc.text("Sistema Blokiox", 50, 15);
            doc.text("CNPJ: 00.000.000/0000-00", 50, 20);
            doc.text("Telefone: (xx) xxxx-xxxx", 50, 25);
            doc.text("E-mail: sistemablokiox@gmail.com", 50, 30);
            doc.text("Endereço: Rua das Oficinas, 123 - Centro, São Paulo - SP", 50, 35);

            // Adiciona os dados do cliente como uma tabela
            const dadosCliente = [
                ["Nome", document.getElementById("nome").value],
                ["Endereço", document.getElementById("endereco").value],
                ["Bairro", document.getElementById("bairro").value],
                ["Telefone", document.getElementById("telefone").value],
                ["Veículo", document.getElementById("veiculo").value],
                ["Placa", document.getElementById("placa").value],
                ["Cor", document.getElementById("cor").value],
                ["Ano", document.getElementById("ano").value],
                ["Data", document.getElementById("data").value],
              ["Orçamentista", document.getElementById("orcamentista").value],
               ["Validade do orçamento em dias", document.getElementById("validade").value],
            
            ];

            // Centraliza o texto "Dados do Cliente"
            doc.setFontSize(18);
            doc.setTextColor(255, 0, 0); // vermelho

            const text = "Orçamento";
            const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            const pageWidth = doc.internal.pageSize.getWidth();
            const x = (pageWidth - textWidth) / 2;

            doc.text(text, x, 50);

            doc.autoTable({
                startY: 60, // Posição vertical inicial da tabela
                head: [['Dados do Cliente', '']], // Cabeçalho da tabela
                body: dadosCliente, // Dados da tabela
                theme: 'grid', // Estilo da tabela (grid, striped, plain)
                headStyles: {
                    fillColor: [0, 0, 0], // Cor de fundo do cabeçalho
                    textColor: [255, 255, 255], // Cor do texto do cabeçalho
                    fontSize: 10, // Tamanho da fonte do cabeçalho
                },
                bodyStyles: {
                    textColor: [0, 0, 0], // Cor do texto do corpo
                    fontSize: 9, // Tamanho da fonte do corpo
                },
                alternateRowStyles: {
                    fillColor: [240, 240, 240], // Cor de fundo das linhas alternadas
                },
                margin: { left: 10, right: 10 }, // Margens para limitar a largura
                tableWidth: maxWidth, // Largura máxima da tabela
            });

            // Adiciona a tabela de serviços
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0); // Azul escuro
            doc.text("Mão de obra:", 10, doc.autoTable.previous.finalY + 10);

            // Filtra apenas as linhas de serviços com valor e opções selecionadas
            const rows = document.querySelectorAll("#servicos tr");
            const servicosComValor = [];
            rows.forEach(row => {
                const valorInput = row.querySelector(".valor-servico");
                const valor = parseFloat(valorInput?.value) || 0;
                if (valor > 0) {
                    const peca = row.querySelector("td").textContent;
                  
                    

                    // Coleta as opções selecionadas (checkboxes marcados)
                    const opcoesSelecionadas = [];
                    const checkboxes = row.querySelectorAll('input[type="checkbox"]:checked');
                    checkboxes.forEach(checkbox => {
                        opcoesSelecionadas.push(checkbox.parentElement.textContent.trim());
                    });

                    const descricao = opcoesSelecionadas.join(", "); // Junta as opções selecionadas
                    servicosComValor.push([peca, descricao, `R$ ${valor.toFixed(2)}`]);
                }
            });
          
          
          
          
                    
 
      
          
          

            // Cria a tabela de serviços no PDF
            doc.autoTable({
                startY: doc.autoTable.previous.finalY + 20, // Posição vertical inicial da tabela
                head: [['Peça', 'Descrição', 'Valor (R$)']], // Cabeçalho da tabela
                body: servicosComValor, // Dados da tabela
                theme: 'grid', // Estilo da tabela (grid, striped, plain)
                headStyles: {
                    fillColor: [0, 0, 0], // Cor de fundo do cabeçalho
                    textColor: [255, 255, 255], // Cor do texto do cabeçalho
                    fontSize: 10, // Tamanho da fonte do cabeçalho
                },
                bodyStyles: {
                    textColor: [0, 0, 0], // Cor do texto do corpo
                    fontSize: 9, // Tamanho da fonte do corpo
                },
                alternateRowStyles: {
                    fillColor: [240, 240, 240], // Cor de fundo das linhas alternadas
                },
                margin: { left: 10, right: 10 }, // Margens para limitar a largura
                tableWidth: maxWidth, // Largura máxima da tabela
            });

 
    
         
          
          
            // Adiciona o total no canto direito, respeitando a margem e largura da tabela de serviços
            const totalText = `Total: R$ ${document.getElementById("total").textContent}`;
            const totalTextWidth = doc.getStringUnitWidth(totalText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            const tableWidth = 180; // Largura da tabela de serviços
            const marginLeft = 10; // Margem esquerda da tabela de serviços
            const marginRight = 10; // Margem direita da tabela de serviços

            // Calcula a posição x dentro da largura da tabela
            let xPosition = marginLeft + tableWidth - totalTextWidth - marginRight;

            // Verifica se a posição x respeita a margem esquerda
            if (xPosition < marginLeft) {
                xPosition = marginLeft; // Garante que o texto não ultrapasse a margem esquerda
            }

            // Ajusta o tamanho da fonte para 18 e a cor para vermelho
            doc.setFontSize(18); // Tamanho da fonte aumentado para 18
            doc.setTextColor(0, 0, 0); // Cor vermelha (RGB: 255, 0, 0)
            doc.text(totalText, xPosition, doc.autoTable.previous.finalY + 10);
          
          
          
 
     
          
          
          
// Adicionar observações
const observacoes = document.getElementById('observacoes').value;
if (observacoes) {
    doc.setFontSize(12); // Tamanho da fonte do título

    const lineHeight = 8; // Ajustado para o novo tamanho da fonte
    const startX = 10;
    let startY = doc.autoTable.previous.finalY + 10 + (2 * lineHeight); // Pula 2 linhas

    // Adicionar o título "Observações:"
    doc.text("Observações:", startX, startY);
    doc.setFontSize(8); // Ajustando a fonte do texto para 8

    const maxWidth = doc.internal.pageSize.width - 40; // Largura máxima (considerando margens)
    const pageHeight = doc.internal.pageSize.height - 20; // Altura máxima (considerando margens)

    // Dividir o texto em múltiplas linhas
    const observacoesLines = doc.splitTextToSize(observacoes, maxWidth);
    
    let currentY = startY + 10; // Posição Y do texto das observações
    let remainingLines = [...observacoesLines]; // Copia todas as linhas para processamento

    while (remainingLines.length > 0) {
        // Quantidade de linhas que cabem na página atual
        let availableSpace = pageHeight - currentY;
        let maxLinesPerPage = Math.floor(availableSpace / lineHeight);
        let linesToPrint = remainingLines.slice(0, maxLinesPerPage);
        
        // Adiciona as linhas que cabem na página atual
        doc.text(linesToPrint, startX, currentY);

        // Atualiza o restante das linhas
        remainingLines = remainingLines.slice(maxLinesPerPage);

        // Se ainda houver linhas, cria uma nova página
        if (remainingLines.length > 0) {
            doc.addPage();
            currentY = 20; // Reinicia a posição no topo da nova página
            doc.setFontSize(12);
            doc.text("Continuação da observação do orçamento:", startX, currentY);
            doc.setFontSize(8);
            currentY += 10;
        }
    }

  
}


          
          
          
          // Adiciona o rodapé com os textos
const footerText1 = "A Blokiox é um sistema de uso aberto e livre e não se responsabiliza por orçamentos gerados por seus usuários.";
const footerText2 = "Orçamento gerado através do sistema Blokiox: www.blokiox.com"; // Novo aviso
const pageHeight = doc.internal.pageSize.getHeight(); // Altura da página
const footerY1 = pageHeight - 15; // Posição Y do primeiro rodapé (15mm da parte inferior)
const footerY2 = pageHeight - 10; // Posição Y do segundo rodapé (10mm da parte inferior)

// Adiciona o primeiro rodapé (centralizado, preto e tamanho 6)
doc.setFontSize(6); // Tamanho da fonte do primeiro rodapé
doc.setTextColor(255, 0, 0); // Cor do texto (preto)
doc.text(footerText1, doc.internal.pageSize.getWidth() / 2, footerY1, { align: 'center' });

// Adiciona o segundo rodapé (centralizado, vermelho e tamanho 8)
doc.setFontSize(6); // Tamanho da fonte do segundo rodapé
doc.setTextColor(0, 0, 0); // Cor do texto (vermelho)
doc.text(footerText2, doc.internal.pageSize.getWidth() / 2, footerY2, { align: 'center' });
          
          
          
       

          
          
          
          
          
          
          
          
          

            // Salva o PDF
            doc.save('orcamento.pdf');
        }
