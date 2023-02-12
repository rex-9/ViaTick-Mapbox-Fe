<a name="readme-top"></a>

# 📗 Table of Contents

- [📗 Table of Contents](#-table-of-contents)
- [📖 \[ViaTick Mapbox on Rails\] ](#-viatick-mapbox-on-rails-)
  - [🛠 Built With ](#-built-with-)
    - [Tech Stack ](#tech-stack-)
    - [Key Features ](#key-features-)
  - [💻 Getting Started ](#-getting-started-)
    - [Setup](#setup)
    - [Install](#install)
      - [1. Navigate to the location of the folder in your machine:](#1-navigate-to-the-location-of-the-folder-in-your-machine)
      - [2. Install the gems:](#2-install-the-gems)
    - [Usage](#usage)
      - [3. Run the server on port 3001:](#3-run-the-server-on-port-3001)
  - [👥 Authors ](#-authors-)
  - [🤝 Contributing ](#-contributing-)
  - [⭐️ Show your support ](#️-show-your-support-)
  - [🙏 Acknowledgments ](#-acknowledgments-)
  - [❓ FAQ ](#-faq-)
  - [📝 License ](#-license-)

# 📖 [ViaTick Mapbox on Rails] <a name="about-project"></a>

**[Reactive ViaTick Mapbox]** is the backend of the coding assignment assigned to my by [ViaTick](https://www.viatick.com/).

Backend of this Project can be found [here](https://github.com/rex-9/ViaTick-Mapbox-Be)

## 🛠 Built With <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>

<details>
  <summary>Client</summary>
  <ul>
    <li>
      <a href="https://reactjs.org/">React.js</a>
      <a href="https://www.mapbox.com/fleet/">Mapbox</a>
      <a href="https://tailwindcss.com/">TailwindCSS</a>
      <a href="https://vitejs.dev/">Vite</a>
    </li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://rubyonrails.org/">Ruby on Rails</a></li>
  </ul>
</details>

<details>
<summary>Database</summary>
  <ul>
    <li><a href="https://www.postgresql.org/">PostgreSQL</a></li>
  </ul>
</details>

### Key Features <a name="key-features"></a>

- **Add Pins to the Map**
- **Generate the nearest Routes**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 💻 Getting Started <a name="getting-started"></a>

To get a local copy up and running, follow these steps.

### Setup

Clone this repository to your desired folder:

```sh
  cd my-folder
  git clone https://github.com/rex-9/ViaTick-Mapbox-Fe.git
```

### Install

#### 1. Navigate to the location of the folder in your machine:

```
you@your-Pc-name:~$ cd <ViaTick-Mapbox-Fe>
```

#### 2. Install the gems:

```
npm install
```

### Usage

To run the project, execute the following command:

#### 3. Run the server on port 3001:

```
npm run dev
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 👥 Authors <a name="authors"></a>

👤 **Rex**

- Github: [@rex-9](https://github.com/rex-9/)
- Medium: [@rex9](https://medium.com/rex9/)
- LinkedIn: [@rex9](https://www.linkedin.com/in/rex9/)
- Facebook: [@htetnaing0814](https://www.facebook.com/htetnaing0814)
- Foundit: [@rex9](https://www.foundit.in/seeker/profile?application_source=organic&apop=my-profile)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🤝 Contributing <a name="contributing"></a>

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](../../issues/).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## ⭐️ Show your support <a name="support"></a>

If you like this project, please kindly offer me opportunities for further contributions.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🙏 Acknowledgments <a name="acknowledgements"></a>

I would like to thank **Edmund@Viatick** for giving the Inspiration and Funds to build this project.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## ❓ FAQ <a name="faq"></a>

- **What can be improved in this project?**

  - The Algorithm finding the shortest path to the route can be improved by using the Estimated Distance provided by the Mapbox Directions API.
  - I do confess that I didn't see [this article](https://www.freecodecamp.org/news/dijkstras-shortest-path-algorithm-visual-introduction/) provided in the assignment and I implemented the algorithm on my own without reading any article.
  - The Pythagoras theorem is used to find the shortest path for now.
  - It can be improved by using the Estimated Distance provided by the Mapbox Directions API.

- **What is the thing you know that need to be improved but you don't know how to improve that?**

  - I have not made research into the algorithm with the consideration of the traffic data.
  - It seems like Mapbox provides it but I still don't know how to implement it yet since I didn't get enough time to research and study about it.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 📝 License <a name="license"></a>

This project is [MIT](./LICENSE) licensed.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
