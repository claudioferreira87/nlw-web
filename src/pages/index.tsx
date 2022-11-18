import appPreviewImage from '../assets/app-nlw-copa-preview.png';
import avatarsExampleImage from '../assets/users-avatar-example.png';
import logoImage from '../assets/logo.svg';
import Image from 'next/image';
import iconCheckImage from '../assets/icon-check.svg';
import { api } from '../lib/axios';
import { FormEvent, useState } from 'react';

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}


export default function Home({ poolCount, guessCount, userCount }: HomeProps) {

  const [pool, setPool] = useState('')

  const createPool = async (ev: FormEvent) => {
    ev.preventDefault()
    try {
      const response = await api.post('/pools', {
        title: pool
      })

      setPool('');

      const { code } = response.data

      await navigator.clipboard.writeText(code);

      alert("Bolao criado com sucesso, o codigo foi copiado para a area de transferencia")
    } catch (err) {
      alert('falha ao criar')
    }
  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center'>
      <main>
        <Image src={logoImage} alt="NLW Copa Logo" />
        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>Crie seu proprio Bolao da Copa e compartilhe entre amigos!</h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={avatarsExampleImage} alt="Exemplo de Avatares participantes" />
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{userCount}</span> pessoas ja estao usando
          </strong>
        </div>
        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
            type="text"
            required
            placeholder='Qual o nome do seu bolao?'
            value={pool}
            onChange={event => setPool(event.target.value)} />
          <button className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700' type='submit'>CRIAR MEU BOLAO</button>
        </form>
        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImage} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{poolCount}</span>
              <span>Boloes criados</span>
            </div>
          </div>
          <div className='w-px h-14 bg-gray-600' />
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImage} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image src={appPreviewImage} alt="Dois celulares exibindo uma previa da aplicaçao" quality={100} />
    </div>
  )
}

export const getServerSideProps = async () => {

  const [poolCountResponse, guessesCountResponse, userCountResponse] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count')
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessesCountResponse.data.count,
      userCount: userCountResponse.data.count,
    }
  }
}
