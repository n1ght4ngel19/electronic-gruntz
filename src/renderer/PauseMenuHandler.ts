import {Stage} from './Stage';

export class PauseMenuHandler {
  /**
   * Constructor
   *
   * @param {Stage} stage - The stage on which the class will work
   */
  constructor(stage: Stage) {
    this.stage = stage;
  }

  stage: Stage;

  /**
   * Handles the presentation of the in-game pause menu
   * and the actions associated with it, e.g. resuming,
   * saving, or quitting the game.
   */
  handlePause(): void {
    this.stage.input.keyboard.on('keydown-ESC', () => {
      // @ts-ignore
      document.getElementById('menu').style.display = 'block';
      this.stage.scene.pause('stage');
    });

    // Navigation with the pointer
    document.addEventListener('click', (event) => {
      // @ts-ignore
      switch (event.target.id) {
        case 'resume': {
          // @ts-ignore
          document.getElementById('menu').style.display = 'none';
          this.stage.scene.resume('stage');
          break;
        }
        case 'save': {
          console.log('Saving...');
          break;
        }
        case 'load': {
          console.log('Loading...');
          break;
        }
        case 'help': {
          console.log('Help...');
          break;
        }
        case 'quit': {
          window.location.href = 'rocky-roadz.html';
          break;
        }
        default: {
          break;
        }
      }
    });

    // Navigation with the arrow keys
    document.onkeydown = (event) => {
      if (document.getElementsByClassName('active')[0] != null) {
        if (event.code === 'ArrowDown') {
          // @ts-ignore
          if (document.getElementsByClassName('active')[0].nextElementSibling == null) {
            document.getElementsByClassName('active')[0].classList.remove('active');
            document.getElementsByClassName('menu-option')[0].classList.add('active');
          } else {
            // @ts-ignore
            document.getElementsByClassName('active')[0].nextElementSibling.classList.add('active');
            document.getElementsByClassName('active')[0].classList.remove('active');
          }
        } else if (event.code === 'ArrowUp') {
          // @ts-ignore
          if (document.getElementsByClassName('active')[0].previousElementSibling == null) {
            document.getElementsByClassName('active')[0].classList.remove('active');
            document.getElementsByClassName('menu-option')[document.getElementsByClassName('menu-option').length - 1].classList.add('active');
          } else {
            // @ts-ignore
            document.getElementsByClassName('active')[0].previousElementSibling.classList.add('active');
            document.getElementsByClassName('active')[1].classList.remove('active');
          }
        } else if (event.code === 'Enter') {
          // @ts-ignore
          document.getElementsByClassName('active')[0].click();
        }
      } else {
        // @ts-ignore
        document.getElementsByClassName('menu-option')[0].classList.add('active');
      }
    };

    document.addEventListener('mouseover', (event) => {
      // @ts-ignore
      if (event.target.classList.contains('menu-option')) {
        document.getElementsByClassName('active')[0].classList.remove('active');
        // @ts-ignore
        event.target.classList.add('active');
      }
    });
  }
}
