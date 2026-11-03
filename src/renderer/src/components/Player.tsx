export default function Player(): React.JSX.Element {
  return (
    <div>
      <div>Music</div>
      <div>
        <p>Title</p>
      </div>
      <div>
        <p>Progress Bar</p>
      </div>
      <div>
        <ul>
          <button>shuffle</button>
          <button>previous</button>
          <button>play/pause</button>
          <button>next</button>
          <button>repeat</button>
        </ul>
      </div>
    </div>
  )
}
