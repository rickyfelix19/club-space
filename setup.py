# this is basially a package.lock version of python

from setuptools import setup, find_packages

requires = [
    'flask'
]

setup(
    name='club-space',
    version='1.0',
    description='A video conference style application, to allow people to play games and have interactions',
    author='check github',
    author_email='<Your actual e-mail address here>',
    keywords='web flask',
    packages=find_packages(
        'python-dotenv',
        'flask',
        'pipenv'
    ),
    include_package_data=True,
    install_requires=requires
)