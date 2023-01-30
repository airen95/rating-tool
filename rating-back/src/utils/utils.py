import os


def load_txt(filename) -> list[str]:
    if os.path.isfile((filename)):
        data = open(filename, 'r')
        data = data.readlines()
        data = [i.replace('\n', '') for i in data]
        return data
    else:
        return []

def write_txt(filename, data):
    with open(filename, 'a') as f:
        f.write(f'{data}\n')

