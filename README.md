# 🥟 Nepali Momos Brampton

A modern, responsive web application for Nepali Momos restaurant in Brampton, built with Angular 14. This application provides a comprehensive digital experience for customers to explore authentic Nepali cuisine, browse menus, place orders, and learn about catering services.

## 🌟 Features

### Core Functionality
- **Interactive Menu System**: Browse categorized menu items with detailed descriptions and pricing
- **Shopping Cart**: Add items to cart with customization options and quantity management
- **Order Customization**: Personalize orders with various options, sizes, and special instructions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Image Gallery**: Visual showcase of restaurant ambiance and food items
- **Contact & Location**: Easy access to restaurant information and contact details

### Advanced Features
- **Dynamic Pricing**: Real-time price calculation based on selected options
- **Auto-playing Video Popups**: Engaging multimedia content on the homepage
- **SEO Optimization**: Built-in SEO service for better search engine visibility
- **Local Storage**: Persistent cart data across browser sessions
- **Professional Branding**: Consistent brand identity throughout the application

## 🛠️ Technology Stack

- **Framework**: Angular 14.2.0
- **Language**: TypeScript 4.7.2
- **Styling**: SCSS with responsive design
- **UI Components**: Custom components with Angular Material icons
- **Image Slider**: ng-image-slider for gallery functionality
- **Build Tool**: Angular CLI 14.2.13
- **Testing**: Jasmine & Karma

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── navbar/           # Navigation component
│   │   ├── footer/           # Footer with branding
│   │   ├── home/             # Homepage with hero section
│   │   ├── menu/             # Main catering page
│   │   ├── menu-two/         # Main menu component
│   │   ├── cart/             # Shopping cart functionality
│   │   ├── checkout/         # Order checkout process
│   │   ├── gallery/          # Image gallery
│   │   ├── about-us/         # About page
│   │   ├── contact-us/       # Contact information
│   │   ├── catering/         # Catering services
│   │   └── services/         # Utility services
│   ├── assets/
│   │   ├── data/             # Menu data (JSON)
│   │   └── images/           # Static images
│   └── styles/               # Global styles and variables
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Angular CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nepali-momos-brampton.git
   cd nepali-momos-brampton
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200/` in your browser.

### Build for Production

```bash
ng build --prod
```
Build artifacts will be stored in the `dist/` directory.

## 🧪 Testing

### Unit Tests
```bash
ng test
```
Executes unit tests via Karma test runner.

### End-to-End Tests
```bash
ng e2e
```
Run end-to-end tests using your preferred testing platform.

## 📱 Key Components

### Menu System
- **Dynamic Categories**: Automatically organized menu categories
- **Item Customization**: Options for size, toppings, and special requests
- **Price Calculation**: Real-time pricing based on selections
- **Responsive Layout**: Optimized for all screen sizes

### Shopping Cart
- **Persistent Storage**: Cart data saved in local storage
- **Quantity Management**: Easy increment/decrement controls
- **Order Summary**: Clear breakdown of items and pricing
- **Checkout Integration**: Seamless transition to order completion

### User Experience
- **Loading States**: Spinner component for better UX
- **Error Handling**: Graceful error management
- **Accessibility**: WCAG compliant design elements
- **Performance**: Optimized images and lazy loading

## 🎨 Styling & Design

- **SCSS Architecture**: Modular stylesheets with variables and mixins
- **Responsive Design**: Mobile-first approach with breakpoints
- **Brand Consistency**: Unified color scheme and typography
- **Custom Animations**: Smooth transitions and hover effects

## 🔧 Configuration

### Environment Settings
- Development: `src/environments/environment.ts`
- Production: `src/environments/environment.prod.ts`

### Menu Data
Menu items and categories are managed through JSON files in `src/assets/data/`.

## 📈 Performance Optimization

- **Lazy Loading**: Route-based code splitting
- **Image Optimization**: Compressed images with proper formats
- **Bundle Analysis**: Optimized build size
- **Caching Strategy**: Efficient browser caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and inquiries:
- **Restaurant**: Nepali Momos Brampton
- **Email**: Nepalimomos@outlook.com
- **Phone**: +1 905-874-4141
- **Address**: 90 Eastern Ave #28, Brampton, ON L6W 1X9

## 🙏 Acknowledgments

- Angular team for the robust framework
- Contributors and maintainers
- The vibrant Nepali community in Brampton

---

**Built with ❤️ for the Nepali community in Brampton**
