# seif-integration-sample

[Please refer to the attached file link.](https://github.com/HAECHI-LABS/seif-integration-sample/blob/main/src/app/providers.tsx)

[Download Seif Extension](https://chromewebstore.google.com/detail/seif/albakdmmdafeafbehmcpoejenbeojejl)

![RainbowKit Integration Image](rainbowkit_sample.png)

# Caution
When developing a dApp on your local PC, you must use an HTTPS certificate to connect to a Seif wallet. For security reasons, the window.__seif instance will not be injected in an unsecured connection situation, which can be problematic when connecting to a provider.

If you are using Next.js, please refer to the following link:
https://vercel.com/guides/access-nextjs-localhost-https-certificate-self-signed#enabling-https-for-local-development

If you are developing with Create React App, please refer to the following link:
https://create-react-app.dev/docs/using-https-in-development/

If you are using the Vite bundler, please refer to the following link:
https://ko.vitejs.dev/config/server-options#server-https
