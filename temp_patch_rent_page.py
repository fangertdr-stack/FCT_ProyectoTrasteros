from pathlib import Path

path = Path('src/app/pages/rent-page/rent-page.ts')
text = path.read_text(encoding='utf-8')
needle = """        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener usuario:', err);
        this.showMessage('No se pudieron cargar los datos del usuario');
      }
    });
  }


  pagar() {
"""
replacement = """        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener usuario:', err);
        this.showMessage('No se pudieron cargar los datos del usuario');
      }
    });
  }

  private normalizeUserResponse(userData: any): any {
    if (!userData) {
      return null;
    }

    let rawUser = userData.data ?? userData;

    if (Array.isArray(rawUser)) {
      rawUser = rawUser[0] ?? null;
    }

    return rawUser;
  }

  pagar() {
"""
if needle not in text:
    raise SystemExit('Needle not found')
path.write_text(text.replace(needle, replacement), encoding='utf-8')
print('Inserted helper')
