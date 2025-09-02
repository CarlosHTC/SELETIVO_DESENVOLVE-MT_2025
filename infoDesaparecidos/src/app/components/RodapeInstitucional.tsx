export default function RodapeInstitucional() {
    return (
      <footer className="bg-gray-900 text-gray-300 py-6 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p>© {new Date().getFullYear()} -  Lucas Henrique Tasca de Araujo</p>
            <p>Todos os direitos reservados</p>
            <p>Pagina gerada com o intuito de participar do seletivo 2025</p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Termos de Uso</a>
            <a href="#" className="hover:underline">Política de Privacidade</a>
          </div>
        </div>
      </footer>
    );
  }
  