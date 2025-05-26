const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Set the public path to an absolute URL in production or relative in development
      const isProduction = process.env.NODE_ENV === 'production';
      const publicPath = isProduction ? 'https://game-center-rosy.vercel.app/' : 'http://localhost:3001/';
      
      webpackConfig.output.publicPath = publicPath;
      
      // Add Module Federation Plugin
      webpackConfig.plugins.push(
        new ModuleFederationPlugin({
          // Name of this remote module
          name: 'gameCenter',
          
          // Filename that will contain the remote entry
          filename: 'remoteEntry.js',
          
          // Components/modules to expose to the host application
          exposes: {
            './GameCenter': './src/components/GameCenter/index.jsx',
          },
          
          // Libraries that should be shared between host and remote
          // Using React 17 versions to match the portfolio
          shared: {
            react: { 
              singleton: true, 
              requiredVersion: "^17.0.2" 
            },
            'react-dom': { 
              singleton: true, 
              requiredVersion: "^17.0.2" 
            },
            'react-router-dom': { 
              singleton: true, 
              requiredVersion: "^5.3.4" 
            }
          },
        })
      );
      
      return webpackConfig;
    },
  },
  // Set the development server port to avoid conflicts with your main portfolio
  devServer: {
    port: 3001,
  }
};