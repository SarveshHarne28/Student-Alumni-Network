// components/Navigation.jsx (if you have one, or add to existing nav)
const Navigation = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-blue-600">
              JNEC Alumni
            </Link>
            
            {/* Add Messages link here */}
            <Link 
              to="/messages" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              💬 Messages
            </Link>
            
            {/* Your other nav links */}
            <Link to="/opportunities" className="text-gray-700 hover:text-blue-600">
              Opportunities
            </Link>
            <Link to="/connections" className="text-gray-700 hover:text-blue-600">
              Connections
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* User menu */}
          </div>
        </div>
      </div>
    </nav>
  );
};