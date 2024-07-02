'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Logo from './art/Logo';




const Navbar = ({session, status}:any) => {


  const navItems = [
    { href: '/churches', label: 'Churches and Orgs' },
    { href: '/missions', label: 'Missions' },
    { href: '/about', label: 'About' },
    { href: session?.user?.role === 'admin' ? '/auth/signup' : '/apply', label: session?.user?.role === 'admin' ? 'Register An Admin' : 'Apply' },
    { href: '/donate', label: 'Donate' },
    { href: status === 'unauthenticated'? '/api/auth/signin' : '/api/auth/signout', label: status === 'unauthenticated'? 'Log in': 'Log out'},
  ];
  



  return (
    <nav className='flex justify-between w-full items-end  py-2 px-4'>
      
        <Logo />

        {status === 'authenticated' && session?.user && (
          <div className='text-center '>
            <p>Hello, {session.user.name}</p>
          </div>
        
        )}
        

        <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-end px-3 font-text text-black "
    >
      <div className="flex gap-4">
        {navItems.map((item) => (
          <Link href={item.href} key={item.label}>
            <motion.button 
            whileHover={{ scale: 1.1 }}
            className=" px-3  rounded-md transition duration-300 ease-in-out text-2xl">
              {item.label}
            </motion.button>
          </Link>
        ))}
      </div>
    </motion.div>
    </nav>
  );
};

export default Navbar;
