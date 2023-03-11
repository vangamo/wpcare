export default function Page({
  name,
  title,
  description,
  children: innerHTML,
}) {
  return (
    <section className={name}>
      <div className='main__background'></div>
      <div className='main__wrapper'>
        <div className='main__header'>
          <h2 className='main__title'>{title}</h2>
          <p className='main__description'>{description}</p>
        </div>
        <div className='content'>{innerHTML}</div>
        {'<!-- .content -->'}
      </div>
    </section>
  );
}
